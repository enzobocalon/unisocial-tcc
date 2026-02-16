import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LikeableEntities } from 'src/entities/actions.entity';
import { ResponseEntity } from 'src/entities/response.entity';
import { LikeRepository } from 'src/shared/database/repositories/likes.repositories';
import { PostRepository } from 'src/shared/database/repositories/posts.repositories';
import { UtilsService } from 'src/shared/utils/utils.service';
import { Post } from '../posts/entities/post.entity';
import {
  BASE_USER_SELECTOR,
  NotificationsIds,
  PAGE_SIZE,
} from 'src/common/constants';
import { NotificationsService } from '../notifications/services/notifications.service';
import { ReplyRepository } from 'src/shared/database/repositories/replies.repositories';

const includedItems = {
  post: {
    select: {
      id: true,
      content: true,
      hasMedia: true,
      media: {
        select: {
          id: true,
          url: true,
        },
      },
      isShared: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      parentId: true,
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
      parent: {
        select: {
          id: true,
          content: true,
          hasMedia: true,
          isShared: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          parentId: true,
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
      },
      user: {
        select: BASE_USER_SELECTOR,
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
      like: {
        select: {
          userId: true,
        },
        where: {
          replyId: null,
        },
      },
      posts: {
        where: {
          content: null,
          hasMedia: false,
        },
        select: {
          userId: true,
        },
      },
    },
  },
  user: {
    select: BASE_USER_SELECTOR,
  },
};

type IncludedItems = Prisma.LikeGetPayload<{
  include: typeof includedItems;
}> & {
  post: Post;
};
@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepo: LikeRepository,
    private readonly utilsService: UtilsService,
    private readonly postRepo: PostRepository,
    private readonly replyRepo: ReplyRepository,
    private readonly notService: NotificationsService,
  ) {}

  async like(
    id: string,
    entity: LikeableEntities,
    userId: string,
  ): Promise<ResponseEntity> {
    const data = {
      userId,
      [entity.toLowerCase() + 'Id']: id,
    };
    let receiverId = '';
    let postId: string | null = null;
    let replyId: string | null = null;
    const isAlreadyLiked = await (entity === 'POST'
      ? this.likesRepo.findFirst({
          where: {
            userId,
            postId: id,
            replyId: null,
          },
        })
      : this.likesRepo.findFirst({
          where: {
            userId,
            replyId: id,
          },
        }));

    if (isAlreadyLiked) {
      return {
        message: 'Post já curtido',
        success: false,
      };
    }

    if (entity === LikeableEntities.POST) {
      const post = await this.postRepo.findFirst({
        where: {
          id,
        },
      });
      receiverId = post.userId;
      if (!post) {
        return {
          message: 'Post não encontrado',
          success: false,
        };
      }

      postId = post.id;
      if (post.isShared && !post.content && !post.hasMedia) {
        data.postId = post.parentId;
      }
    } else {
      const reply = await this.replyRepo.findFirst({
        where: {
          id,
        },
      });

      if (!reply) {
        return {
          message: 'Resposta não encontrada',
          success: false,
        };
      }

      receiverId = reply.userId;
      postId = reply.postId;
      replyId = reply.id;
      data.postId = reply.postId;
      data.replyId = reply.id;
    }
    await this.likesRepo.create({
      data,
    });

    if (receiverId !== userId) {
      await this.notService.create({
        receiverId: [receiverId],
        emitterId: userId,
        typeId: NotificationsIds.LIKE,
        message: replyId ? 'curtiu seu comentário' : 'curtiu sua publicação',
        entity: {
          type: 'DEFAULT',
          postId,
          replyId,
        },
      });
    }
    return {
      message: 'Post curtido com sucesso',
      success: true,
    };
  }

  async getLikeByPostId(postId: string, page: number) {
    const includedItems = {
      user: {
        select: BASE_USER_SELECTOR,
      },
    };

    type IncludedItems = Prisma.LikeGetPayload<{
      include: typeof includedItems;
    }>;
    const likes = (
      (await this.likesRepo.findMany({
        where: {
          postId,
          replyId: null,
        },
        include: includedItems,
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      })) as IncludedItems[]
    ).map((like) => like.user);

    const count = await this.likesRepo.count({
      where: {
        postId,
      },
    });

    return {
      like: likes,
      count,
    };
  }

  async unlike(
    id: string,
    entity: LikeableEntities,
    userId: string,
  ): Promise<ResponseEntity> {
    const likedEntity = await this.likesRepo.findFirst({
      where: {
        [entity.toLowerCase() + 'Id']: id,
        userId,
      },
    });

    if (!likedEntity) {
      return {
        message: 'Post não curtido',
        success: false,
      };
    }

    await this.likesRepo.delete({
      where: {
        id: likedEntity.id,
      },
    });

    return {
      message: 'Post descurtido com sucesso',
      success: true,
    };
  }

  async getByUserList(
    userId: string,
    userList: string[],
    page: number,
  ): Promise<Post[]> {
    const likedPosts = (await this.likesRepo.findMany({
      where: {
        userId: {
          in: userList,
        },
      },
      include: includedItems,
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    })) as IncludedItems[];

    const likes = await Promise.all(
      likedPosts.map(async (item) => this.parser(item, userId)),
    );
    return likes;
  }

  async getPostLikesByUserId(id: string, page: number, userId: string) {
    const likedPosts = (await this.likesRepo.findMany({
      where: {
        userId: id,
        replyId: null,
      },
      include: includedItems,
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    })) as IncludedItems[];

    const likes = likedPosts.map((item) => this.parser(item, userId));

    return likes;
  }

  private parser(item: IncludedItems, userId: string): Post {
    const parsedItem = {
      ...item.post,
      key: item.id,
      content: this.utilsService.contentParser(
        item.post.content,
        item.post.mentions.map((mention) => mention.user),
      ),
      shared: item.post.posts.some((post) => post.userId === userId),
      liked: item.post.like.some((like) => like.userId === userId),
      shares: item.post._count.posts,
      likes: item.post._count.like,
      replies: item.post._count.reply,
      parentId:
        item.post.isShared &&
        (item.post.content || item.post.hasMedia) &&
        !item.post.parentId
          ? 'DELETED'
          : item.post.parentId,
      parent: item.post.parent
        ? {
            ...item.post.parent,
            content: this.utilsService.contentParser(
              item.post.parent.content,
              item.post.parent.mentions.map((mention) => mention.user),
            ),
          }
        : null,
      actions: [
        {
          id: item.id,
          author: item.user,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          type: 'LIKE',
        },
      ],
    };
    delete parsedItem.posts;
    delete parsedItem.like;
    delete parsedItem._count;
    return parsedItem;
  }
}
