import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostRepository } from 'src/shared/database/repositories/posts.repositories';
import { Prisma } from '@prisma/client';
import { UtilsService } from 'src/shared/utils/utils.service';
import { LikesService } from '../likes/likes.service';
import { SharesService } from '../shares/shares.service';
import { RepliesService } from '../replies/replies.service';
import { MentionsService } from '../mentions/mentions.service';
import { BASE_USER_SELECTOR, PAGE_SIZE } from 'src/common/constants';
import { FriendshipsService } from '../friendships/friendships.service';
import { MediaRepository } from 'src/shared/database/repositories/medias.repositories';
import { UploadService } from '../upload/upload.service';
import { UsersService } from '../users/users.service';

const includeItems = {
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
  like: {
    select: {
      userId: true,
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
  posts: {
    select: {
      userId: true,
      isShared: true,
      content: true,
      hasMedia: true,
    },
  },
  media: {
    select: {
      id: true,
      url: true,
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

type PostInclude = Prisma.PostGetPayload<{
  include: typeof includeItems;
}> &
  Post & {
    _i: number;
  };

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly likesService: LikesService,
    private readonly sharesService: SharesService,
    private readonly repliesService: RepliesService,
    private readonly mentionsService: MentionsService,
    private readonly utilsService: UtilsService,
    private readonly friendsService: FriendshipsService,
    private readonly mediaRepo: MediaRepository,
    private readonly uploadService: UploadService,
    private readonly usersService: UsersService,
  ) {}
  async create(createPostDTO: CreatePostDTO, userId: string): Promise<Post> {
    const { content, medias } = createPostDTO;

    const mentions = this.mentionsService.extract(content);
    if (!content && !medias.length) {
      throw new BadRequestException('O conteúdo está vazio.');
    }
    const post = (await this.postRepo.create({
      data: {
        content,
        userId,
        hasMedia: medias.length > 0,
        media: {
          create: medias
            .filter(
              (media) =>
                !media.startsWith('file://') ||
                !media.startsWith('blob:') ||
                !media.startsWith('content://'),
            )
            .map((media) => ({
              url: media,
              userId,
            })),
        },
      },
      include: {
        user: {
          select: BASE_USER_SELECTOR,
        },
        media: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    })) as typeof post;

    if (mentions) {
      await this.mentionsService.create(post.id, mentions, 'POST', userId);
      const mentionedUsers = await this.mentionsService.findUsersById(post.id);
      post.content = this.utilsService.contentParser(
        post.content,
        mentionedUsers,
      );
    }

    return {
      ...post,
      likes: 0,
      replies: 0,
      shares: 0,
      liked: false,
      shared: false,
    };
  }

  async findAll(userId: string, page: number) {
    const userAndFriendsIds = await this.friendsService.getUsersFriends(
      userId,
      false,
      true,
    );

    const posts = (await this.postRepo.findMany({
      where: {
        userId: {
          in: userAndFriendsIds,
        },
        isShared: false,
      },
      include: includeItems,
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    })) as PostInclude[];

    const promises = posts.map((post) => this.parser(post, userId));

    try {
      const allPosts = await Promise.all([
        Promise.all(promises),
        Promise.all(
          await this.likesService.getByUserList(
            userId,
            userAndFriendsIds,
            page,
          ),
        ),
        Promise.all(
          await this.sharesService.getByUserList(
            userId,
            page,
            userAndFriendsIds,
          ),
        ),
        Promise.all(
          await this.repliesService.getByUserList(
            userId,
            userAndFriendsIds,
            page,
          ),
        ),
      ]);
      const resolvedPosts = allPosts.flat(1) as PostInclude[];
      resolvedPosts.forEach((post) => {
        const actionDates =
          post.actions?.map((action) => new Date(action.createdAt).getTime()) ||
          [];
        const maxDate = Math.max(
          new Date(post.createdAt).getTime(),
          ...actionDates,
        );
        post._i = maxDate;
      });
      const compare = (a: PostInclude, b: PostInclude) => b._i - a._i;
      const result = this.merger(resolvedPosts).sort(compare);
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async findAllByCourse(userId: string, page: number) {
    const user = await this.usersService.getUser(userId, true);
    const posts = (await this.postRepo.findMany({
      where: {
        user: {
          AND: [
            {
              course: {
                id: user.courseId,
              },
            },
            // Remover próprios posts?
            // {
            //   id: {
            //     not: userId,
            //   },
            // },
          ],
        },
        OR: [
          {
            isShared: false, // Traz todos os posts não compartilhados
          },
          {
            isShared: true, // Traz posts compartilhados com conteúdo ou mídia
            NOT: [
              {
                AND: [
                  {
                    content: null,
                  },
                  {
                    hasMedia: false,
                  },
                ],
              },
            ],
          },
        ],
      },
      include: includeItems,
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    })) as PostInclude[];

    return posts.map((item) => this.parser(item, userId));
  }

  async findByUser(
    id: string,
    page: number,
    userId: string,
    getShare?: boolean,
  ) {
    const posts = (await this.postRepo.findMany({
      where: {
        userId: id,
        isShared: false,
      },
      include: includeItems,
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    })) as PostInclude[];

    const parsedPosts = posts.map((post) => this.parser(post, userId));

    if (getShare) {
      const shares = await this.sharesService.getByUser(id, page, userId);
      const allPosts = [parsedPosts, shares];
      const resolvedPosts = allPosts.flat(1) as PostInclude[];
      resolvedPosts.forEach((post) => {
        const actionDates =
          post.actions?.map((action) => new Date(action.createdAt).getTime()) ||
          [];
        const maxDate = Math.max(
          new Date(post.createdAt).getTime(),
          ...actionDates,
        );
        post._i = maxDate;
      });

      const compare = (a: PostInclude, b: PostInclude) => b._i - a._i;
      return this.merger(resolvedPosts).sort(compare);
    }

    return posts;
  }

  async findById(id: string, userId: string) {
    const post = (await this.postRepo.findUnique({
      where: {
        id,
      },
      include: includeItems,
    })) as PostInclude;
    return this.parser(post, userId);
  }

  async getPostsByContent(content: string, page: number, userId: string) {
    // Shares => se não tiver content, já não aparece de qualquer maneira
    const posts = (await this.postRepo.findMany({
      where: {
        content: {
          contains: content,
        },
      },
      include: includeItems,
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    })) as PostInclude[];
    return posts.map((post) => this.parser(post, userId));
  }

  async update(updatePostInput: UpdatePostDTO, userId: string) {
    // Também atualiza os shares, uma vez que compartilham a mesma estrutura
    if (!userId) {
      throw new UnauthorizedException('Você não tem permissão para isso.');
    }
    const { id, content, medias } = updatePostInput;
    const mentions = this.mentionsService.extract(content);
    if (!content && !medias.length) {
      throw new BadRequestException('O conteúdo está vazio.');
    }

    if (medias.length >= 0) {
      const oldMedias = await this.mediaRepo.findMany({
        where: {
          postId: id,
          userId,
        },
      });

      const filteredMedias = medias.filter(
        (media) =>
          !media.startsWith('file://') &&
          !media.startsWith('blob:') &&
          !media.startsWith('content://'),
      );

      const oldMediaUrls = oldMedias.map((media) => media.url);

      const mediasToDelete = oldMedias.filter(
        (media) => !filteredMedias.includes(media.url),
      );
      const mediasToAdd = filteredMedias.filter(
        (media) => !oldMediaUrls.includes(media),
      );

      for (const media of mediasToDelete) {
        await this.uploadService.deleteFile(media.id, userId);
      }

      if (mediasToAdd.length > 0) {
        const newMediaEntries = mediasToAdd.map((media) => ({
          url: media,
          userId,
          postId: id,
        }));

        await this.mediaRepo.createMany({
          data: newMediaEntries,
        });
      }
    }

    const updatedPost = (await this.postRepo.update({
      data: {
        content: content,
        hasMedia: medias.length > 0,
      },
      where: {
        id,
      },
      include: includeItems,
    })) as PostInclude;

    if (mentions) {
      await this.mentionsService.create(
        updatedPost.id,
        mentions,
        'POST',
        userId,
      );
    }

    return this.parser(updatedPost, userId);
  }

  async remove(id: string, userId: string) {
    const post = (await this.postRepo.findUnique({
      where: {
        id,
      },
      include: {
        media: {
          select: {
            id: true,
            url: true,
            postId: true,
            replyId: true,
          },
        },
      },
    })) as PostInclude;

    if (!post || post.userId !== userId) {
      throw new NotFoundException('Post não encontrado.');
    }

    // BATCH
    const deletedPost = await this.postRepo.delete({
      where: {
        id,
      },
    });

    await this.postRepo.deleteMany({
      where: {
        parentId: null,
        content: null,
        isShared: true,
        hasMedia: false,
      },
    });

    if (post.media) {
      for (const media of post.media!) {
        this.uploadService.deleteFromDisk(media.url);
      }
    }

    return deletedPost;
  }

  async findPostMediaByUserId(id: string, page: number, userId: string) {
    const posts = (await this.postRepo.findMany({
      where: {
        userId: id,
        hasMedia: true,
      },
      include: includeItems,
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    })) as PostInclude[];
    return posts.map((post) => this.parser(post, userId));
  }

  private parser(item: PostInclude, userId: string) {
    item.shares = item._count.posts;
    item.likes = item._count.like;
    item.replies = item._count.reply;
    item.liked = item.like.some((like) => like.userId === userId);
    item.content = this.utilsService.contentParser(
      item.content,
      item.mentions.map((mention) => mention.user),
    );
    if (item.isShared && (item.content || item.hasMedia) && !item.parentId) {
      item.parentId = 'DELETED';
    } else if (item.isShared && item.parent.content) {
      item.parent.content = this.utilsService.contentParser(
        item.parent.content,
        item.parent.mentions.map((mention) => mention.user),
      );
    }
    item.shared = item.posts.some(
      (post) =>
        post.userId === userId &&
        post.isShared &&
        post.content === null &&
        !post.hasMedia,
    );
    delete item._count;
    delete item.like;
    delete item.posts;
    return item;
  }

  private merger(posts: Post[]): Post[] {
    const groupedPosts = new Map<string, Post[]>();
    posts.forEach((post) => {
      const key = `${post.id}_${post.actions?.[0]?.type ?? ''}`;
      const existingGroup = groupedPosts.get(key);
      if (existingGroup) {
        existingGroup.push(post);
      } else {
        groupedPosts.set(key, [post]);
      }
    });

    const mergedPosts = Array.from(groupedPosts.values())
      .map((group) => {
        const hasActions = group.some((post) => !!post.actions);

        if (hasActions) {
          const uniqueActionsByUser = new Map<string, Post['actions'][0]>();
          group.forEach((post) => {
            post.actions?.forEach((action) => {
              uniqueActionsByUser.set(action.author.id, action);
            });
          });

          return {
            ...group[0],
            actions: Array.from(uniqueActionsByUser.values()),
          };
        } else {
          return group;
        }
      })
      .flat();

    return mergedPosts;
  }
}
