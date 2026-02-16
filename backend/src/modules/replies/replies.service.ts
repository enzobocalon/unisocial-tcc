import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReplyDTO } from './dto/create-reply.dto';
import { PostRepository } from 'src/shared/database/repositories/posts.repositories';
import { ReplyRepository } from 'src/shared/database/repositories/replies.repositories';
import { Reply } from './entities/reply.entity';
import { UpdateReplyDTO } from './dto/update-reply.dto';
import { ResponseEntity } from 'src/entities/response.entity';
import { Prisma } from '@prisma/client';
import { Post } from '../posts/entities/post.entity';
import { Actions } from 'src/entities/actions.entity';
import { BaseUser } from '../users/entities/baseUser.entity';
import { UtilsService } from 'src/shared/utils/utils.service';
import { MentionsService } from '../mentions/mentions.service';
import {
  BASE_USER_SELECTOR,
  NotificationsIds,
  PAGE_SIZE,
} from 'src/common/constants';
import { NotificationsService } from '../notifications/services/notifications.service';
import { UploadService } from '../upload/upload.service';
import { MediaRepository } from 'src/shared/database/repositories/medias.repositories';

const includedItems = {
  user: {
    select: BASE_USER_SELECTOR,
  },
  media: {
    select: {
      id: true,
      url: true,
    },
  },
  _count: {
    select: {
      like: true, // não mudar.
      replies: true,
    },
  },
  like: {
    select: {
      userId: true,
    },
  },
  mentions: {
    select: {
      user: {
        select: BASE_USER_SELECTOR,
      },
    },
  },
};

type ReplyInclude = Prisma.ReplyGetPayload<{
  include: typeof includedItems;
}> &
  Reply & {
    parent: {
      userId: string;
    };
  };

const postsInclude = {
  reply: {
    select: {
      id: true,
      user: {
        select: BASE_USER_SELECTOR,
      },
      createdAt: true,
      updatedAt: true,
    },
  },
  mentions: {
    select: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  },
  _count: {
    select: {
      reply: true,
      like: {
        where: {
          replyId: null,
        },
      },
      posts: true,
    },
  },
  user: {
    select: BASE_USER_SELECTOR,
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
  media: {
    select: {
      id: true,
      url: true,
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
            select: {
              id: true,
              name: true,
              username: true,
            },
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
};

type PostInclude = Prisma.PostGetPayload<{
  include: typeof postsInclude;
}> &
  Post & {
    actions: Actions[];
    parent: {
      _count: {
        like: number;
        reply: number;
        posts: number;
      };
    };
    reply: {
      id: string;
      user: BaseUser;
      createdAt: Date;
    };
  };

@Injectable()
export class RepliesService {
  constructor(
    private readonly replyRepo: ReplyRepository,
    private readonly postRepo: PostRepository,
    private readonly utilsService: UtilsService,
    private readonly mentionsService: MentionsService,
    private readonly notService: NotificationsService,
    private readonly uploadService: UploadService,
    private readonly mediaRepo: MediaRepository,
  ) {}
  async create(data: CreateReplyDTO, userId: string): Promise<Reply> {
    const { postId, content, parentId, medias } = data;
    const mentions = this.mentionsService.extract(content);
    if (!content && !medias.length) {
      throw new BadRequestException('O corpo da requisição está vazio');
    }
    const post = await this.postRepo.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    if (parentId) {
      const parent = await this.replyRepo.findFirst({
        where: {
          id: parentId,
          postId,
        },
      });

      if (parent.parentId) {
        throw new BadRequestException('Resposta não pode ser respondida');
      }
    }

    const reply = (await this.replyRepo.create({
      data: {
        content,
        hasMedia: medias.length > 0,
        parentId,
        postId,
        userId,
        media: {
          create: medias.map((media) => ({
            url: media,
            userId,
          })),
        },
      },
      include: {
        parent: {
          select: {
            userId: true,
          },
        },
        media: {
          select: {
            id: true,
            url: true,
          },
        },
        user: {
          select: BASE_USER_SELECTOR,
        },
      },
    })) as ReplyInclude;
    reply.likes = 0;
    reply.liked = false;
    reply.replies = 0;
    if (mentions) {
      await this.mentionsService.create(reply.id, mentions, 'REPLY', userId);
      const mentionedUsers = await this.mentionsService.findUsersById(
        reply.id,
        'REPLY',
      );
      reply.content = this.utilsService.contentParser(
        reply.content,
        mentionedUsers,
      );
    }

    if (post.userId && reply.parent?.userId !== userId) {
      await this.notService.create({
        receiverId: Array.from(
          new Set(
            [
              post.userId !== userId ? post.userId : null,
              reply.parent ? reply.parent.userId : null,
            ].filter((id) => id !== null),
          ),
        ),
        message:
          reply?.parent?.userId === userId
            ? 'respondeu seu comentário'
            : 'respondeu sua publicação',
        emitterId: userId,
        typeId: NotificationsIds.REPLY,
        entity: {
          type: 'DEFAULT',
          postId: reply.postId,
          replyId: reply.id,
        },
      });
    }

    const replyWithMedias = {
      ...reply,
      medias: reply.media.map((m) => ({
        id: m.id,
        replyId: reply.id,
        postId: reply.postId,
        url: m.url,
      })),
    };

    return replyWithMedias;
  }

  async update(data: UpdateReplyDTO, userId: string): Promise<Reply> {
    const { id, content, medias } = data;

    const replyExists = await this.replyRepo.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!replyExists || replyExists.userId !== userId) {
      throw new NotFoundException('Resposta não encontrada');
    }

    if (medias.length >= 0) {
      const oldMedias = await this.mediaRepo.findMany({
        where: {
          replyId: id,
          userId,
        },
      });
      const oldMediaUrls = oldMedias.map((media) => media.url);

      const mediasToDelete = oldMedias.filter(
        (media) => !medias.includes(media.url),
      );
      const mediasToAdd = medias.filter(
        (media) => !oldMediaUrls.includes(media),
      );

      if (mediasToDelete.length > 0) {
        for (const media of mediasToDelete) {
          await this.uploadService.deleteFile(media.id, userId);
        }
      }

      if (mediasToAdd.length > 0) {
        const newMediaEntries = mediasToAdd.map((media) => ({
          url: media,
          userId,
          replyId: id,
        }));

        await this.mediaRepo.createMany({
          data: newMediaEntries,
        });
      }
    }

    const reply = (await this.replyRepo.update({
      where: {
        id,
      },
      data: {
        content,
        hasMedia: medias.length > 0,
      },
      include: includedItems,
    })) as ReplyInclude;
    reply.likes = reply._count.like;
    reply.liked = reply.like.some((like) => like.userId === userId);
    reply.replies = reply._count.replies;

    const replyWithMedias = {
      ...reply,
      medias: reply.media.map((m) => ({
        id: m.id,
        replyId: reply.id,
        postId: reply.postId,
        url: m.url,
      })),
    };

    return replyWithMedias;
  }

  async delete(id: string, userId: string): Promise<ResponseEntity> {
    const replyExists = await this.replyRepo.findUnique({
      where: {
        id,
      },
    });

    if (!replyExists || replyExists.userId !== userId) {
      throw new NotFoundException('Resposta não encontrada');
    }

    if (replyExists.hasMedia) {
      const medias = await this.mediaRepo.findMany({
        where: {
          replyId: id,
        },
      });

      for (const media of medias) {
        await this.uploadService.deleteFile(media.id, userId);
      }
    }

    await this.replyRepo.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Resposta excluída com sucesso',
      success: true,
    };
  }

  async getReplies(
    postId: string,
    userId: string,
    page: number,
    parentId?: string,
  ) {
    const replies = (await this.replyRepo.findMany({
      where: {
        postId,
        parentId: !parentId ? null : parentId,
      },
      include: includedItems,
      orderBy: {
        createdAt: 'asc',
      },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    })) as ReplyInclude[];

    const parsedReplies = replies.map((reply) => {
      if (reply.content.match(/@(\w+)/g)) {
        reply.content = this.utilsService.contentParser(
          reply.content,
          reply.mentions.map((mention) => mention.user),
        );
      }
      const parsedReply = {
        ...reply,
        replies: reply._count.replies,
        likes: reply._count.like,
        liked: reply.like.some((like) => like.userId === userId),
        medias: reply.media,
      };
      delete parsedReply._count;
      delete parsedReply.like;
      return parsedReply;
    });

    return parsedReplies;
  }

  async getByUserList(userId: string, userList: string[], page: number) {
    const posts = (
      (await this.postRepo.findMany({
        where: {
          reply: {
            some: {
              userId: {
                in: userList,
              },
            },
          },
        },
        include: postsInclude,
        orderBy: {
          createdAt: 'desc',
        },
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      })) as PostInclude[]
    ).map((post) => this.parser(post, userId));
    return posts;
  }

  private parser(item: PostInclude, userId: string) {
    item.key = item.reply[0].id;
    item.content = this.utilsService.contentParser(
      item.content,
      item.mentions.map((mention) => mention.user),
    );
    item.shares = item._count.posts;
    item.likes = item._count.like;
    item.replies = item._count.reply;
    item.liked = item.like.some((like) => like.userId === userId);
    item.shared = item.posts.some((post) => post.userId === userId);
    if (item.parent) {
      item.parent.content = this.utilsService.contentParser(
        item.parent.content,
        item.parent.mentions.map((mention) => mention.user),
      );
      delete item.parent.like;
      delete item.parent.posts;
      delete item.parent._count;
    }
    delete item._count;
    // Retorna o último comentário para a timeline
    if (item.reply && item.reply.length) {
      item.reply = item.reply.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    }
    const set = new Set();
    item.actions = item.reply
      .map((reply) => {
        if (!set.has(reply.user.id)) {
          set.add(reply.user.id);
          return {
            id: reply.id,
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt,
            type: 'REPLY',
            author: reply.user,
          };
        }
        return null;
      })
      .filter((replies) => replies !== null);
    return item;
  }
}
