import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from 'src/shared/database/repositories/posts.repositories';
import { CreateShareDTO } from './dto/create-share.dto';
import { ResponseEntity } from 'src/entities/response.entity';
import { Mentions, Prisma } from '@prisma/client';
import { Post } from '../posts/entities/post.entity';
import { UtilsService } from 'src/shared/utils/utils.service';
import { MentionsService } from '../mentions/mentions.service';
import { Mention } from '../mentions/entities/mention.entity';
import {
  BASE_USER_SELECTOR,
  NotificationsIds,
  PAGE_SIZE,
} from 'src/common/constants';
import { NotificationsService } from '../notifications/services/notifications.service';

const includedItems = {
  _count: {
    select: {
      like: {
        where: {
          replyId: null,
        },
      },
      reply: true,
      posts: true,
    },
  },
  user: {
    select: BASE_USER_SELECTOR,
  },
  media: {
    select: {
      id: true,
      url: true,
      postId: true,
    },
  },
  mentions: {
    select: {
      user: {
        select: BASE_USER_SELECTOR,
      },
    },
  },
  parent: {
    select: {
      id: true,
      content: true,
      hasMedia: true,
      createdAt: true,
      updatedAt: true,
      mentions: {
        select: {
          user: {
            select: BASE_USER_SELECTOR,
          },
        },
      },
      user: {
        select: BASE_USER_SELECTOR,
      },
      media: {
        select: {
          id: true,
          url: true,
        },
      },
      like: {
        select: {
          userId: true,
        },
        where: {
          replyId: null,
        },
      },
      posts: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          like: {
            where: {
              replyId: null,
            },
          },
          reply: true,
          posts: true,
        },
      },
    },
  },
  like: {
    select: {
      userId: true,
    },
    where: {
      replyId: null,
    },
  },
  posts: {
    select: {
      userId: true,
    },
  },
} as Prisma.PostInclude;

type ShareInclude = Prisma.PostGetPayload<{
  include: typeof includedItems;
}> &
  Post & {
    parent: {
      _count: {
        like: number;
        reply: number;
        posts: number;
      };
      posts: {
        userId: string;
      }[];
      like: {
        userId: string;
      }[];
      action: string;
    };
    mentions: Mentions[];
  };
@Injectable()
export class SharesService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly utilsService: UtilsService,
    private readonly mentionsService: MentionsService,
    private readonly notService: NotificationsService,
  ) {}
  async createShare(data: CreateShareDTO, userId: string) {
    try {
      const { content, parentId, medias } = data;
      const mentions = content ? this.mentionsService.extract(content) : null;
      if (!parentId) {
        throw new BadRequestException('Post é obrigatório');
      }

      const isPostAlreadyShared = await this.postRepo.findFirst({
        where: {
          userId,
          isShared: true,
          content: null,
          hasMedia: false,
          parentId,
        },
      });
      if (isPostAlreadyShared) {
        throw new ForbiddenException('Post já compartilhado');
      }

      const parentPost = await this.postRepo.findFirst({
        where: {
          id: parentId,
        },
      });

      const canBeShared = parentPost.content || parentPost.hasMedia;

      if (!canBeShared) {
        throw new BadRequestException('O post não pode ser compartilhado');
      }

      const share = (await this.postRepo.create({
        data: {
          content,
          parentId,
          isShared: true,
          userId,
          hasMedia: medias.length > 0,
          media: {
            create: medias.map((media) => ({
              url: media,
              userId,
            })),
          },
        },
        include: includedItems,
      })) as ShareInclude;

      if (mentions) {
        await this.mentionsService.create(share.id, mentions, 'POST', userId);
      }

      if (share.parent.user.id !== userId) {
        await this.notService.create({
          receiverId: [share.parent.user.id],
          emitterId: userId,
          typeId: NotificationsIds.SHARE,
          entity: {
            postId: medias.length > 0 || content ? share.id : parentId,
            type: 'DEFAULT',
          },
        });
      }

      const parsedPost = this.parser(share, userId);
      return parsedPost;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async deleteShare(postId: string, userId: string): Promise<ResponseEntity> {
    try {
      const post = await this.postRepo.findFirst({
        where: {
          OR: [{ id: postId }, { parentId: postId }],
          userId,
          isShared: true,
          content: null,
        },
      });

      if (!post) {
        throw new NotFoundException('Post não encontrado');
      }

      const deletedPost = await this.postRepo.delete({
        where: {
          id: post.id,
          isShared: true,
          userId,
        },
      });

      if (!deletedPost) {
        throw new NotFoundException('Post não encontrado');
      }

      return {
        success: true,
        message: 'Post apagado com sucesso',
        compl_data: post.id,
      };
    } catch {
      throw new InternalServerErrorException('Falha ao apagar o post');
    }
  }

  async getByUserList(userId: string, page: number, userList?: string[]) {
    const shares = (
      (await this.postRepo.findMany({
        where: {
          userId: {
            in: userList,
          },
          isShared: true,
        },
        include: includedItems,
        orderBy: {
          createdAt: 'desc',
        },
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      })) as ShareInclude[]
    ).map((post) => this.parser(post, userId));
    return shares;
  }

  async getShareByPostId(postId: string, page: number) {
    const shares = (await this.postRepo.findMany({
      where: {
        parentId: postId,
        isShared: true,
      },
      select: {
        id: true,
        user: {
          select: BASE_USER_SELECTOR,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    })) as ShareInclude[];

    const count = await this.postRepo.count({
      where: {
        parentId: postId,
        isShared: true,
      },
    });

    return {
      share: shares.map((share) => {
        return {
          id: share.id,
          user: share.user,
        };
      }),
      count,
    };
  }

  async getByUser(id: string, page: number, userId: string) {
    const shares = (
      (await this.postRepo.findMany({
        where: {
          userId: id,
          isShared: true,
        },
        include: includedItems,
        orderBy: {
          createdAt: 'desc',
        },
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      })) as ShareInclude[]
    ).map((post) => this.parser(post, userId));
    return shares;
  }

  parser(item: ShareInclude, userId: string) {
    if (!item.isShared) return item;
    if (!item.content && !item.hasMedia) {
      // Compartilhar comum, sem dados novos.
      const parsedItem = {
        ...item.parent,
        key: item.id,
        content: this.utilsService.contentParser(
          item.parent.content,
          item.parent.mentions.map((mention) => mention.user),
        ),
        isShared: item.isShared,
        createdAt: item.parent.createdAt,
        actions: [
          {
            author: item.user,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: 'SHARE',
          },
        ],
        shares: (item.shares = item.parent._count.posts),
        likes: (item.likes = item.parent._count.like),
        replies: (item.replies = item.parent._count.reply),
        liked: (item.liked = item.parent.like.some(
          (like) => like.userId === userId,
        )),
        shared: (item.shared = item.parent.posts.some(
          (post) => post.userId === userId,
        )),
      };
      delete parsedItem._count;
      delete parsedItem.like;
      delete parsedItem.posts;
      return parsedItem;
    }
    // Compartilhar com dados novos (imagens, texto, etc). Nesse caso, o post é o item e a nova entidade
    item.shares = item._count.posts;
    item.likes = item._count.like;
    item.replies = item._count.reply;
    item.liked = item.like.some((like) => like.userId === userId);
    item.shared = false;
    item.content = this.utilsService.contentParser(
      item.content,
      item.mentions.map((mention: Mention) => mention.user),
    );
    if (!item.parent && (item.content || item.hasMedia)) {
      item.parentId = 'DELETED';
    } else {
      item.parent.content = this.utilsService.contentParser(
        item.parent.content,
        item.parent.mentions.map((mention: Mention) => mention.user),
      );
      delete item.parent._count;
      delete item.parent.like;
      delete item.parent.posts;
    }

    delete item._count;
    delete item.like;
    delete item.posts;

    return item;
  }
}
