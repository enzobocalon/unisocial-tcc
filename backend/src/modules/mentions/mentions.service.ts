import { Injectable } from '@nestjs/common';
import { MentionRepository } from 'src/shared/database/repositories/mentions.repositories';
import { BaseUser } from '../users/entities/baseUser.entity';
import { NotificationsService } from '../notifications/services/notifications.service';
import {
  BASE_USER_SELECTOR,
  NotificationsIds,
  PAGE_SIZE,
} from 'src/common/constants';
import { ReplyRepository } from 'src/shared/database/repositories/replies.repositories';
import { FriendshipsService } from '../friendships/friendships.service';
import { UsersRepository } from 'src/shared/database/repositories/user.repositories';

@Injectable()
export class MentionsService {
  constructor(
    private readonly mentionsRepo: MentionRepository,
    private readonly notService: NotificationsService,
    private readonly replyRepo: ReplyRepository,
    private readonly friendsService: FriendshipsService,
    private readonly usersRepo: UsersRepository,
  ) {}

  async create(
    postId: string,
    mentions: string[],
    type: 'POST' | 'REPLY' = 'POST',
    userId: string,
  ) {
    let replyId: string | null = null;

    const alreadyMentionedUsers = await this.mentionsRepo.findMany({
      where: {
        [type === 'POST' ? 'postId' : 'replyId']: postId,
        userId: {
          in: mentions,
        },
      },
    });

    const removedMentions = alreadyMentionedUsers.filter(
      (mention) => !mentions.some((mentioned) => mentioned === mention.userId),
    );

    if (removedMentions.length) {
      await this.mentionsRepo.deleteMany({
        where: {
          id: {
            in: removedMentions.map((mention) => mention.id),
          },
        },
      });
    }

    if (alreadyMentionedUsers.length) {
      mentions = mentions.filter(
        (mention) =>
          !alreadyMentionedUsers.some(
            (mentioned) => mentioned.userId === mention,
          ),
      );
    }

    await this.mentionsRepo.createMany({
      data: mentions.map((mention) => ({
        userId: mention,
        [type === 'POST' ? 'postId' : 'replyId']: postId,
      })),
    });

    if (type === 'REPLY') {
      const reply = await this.replyRepo.findUnique({
        where: {
          id: postId,
        },
        select: {
          postId: true,
        },
      });

      postId = reply.postId;
      replyId = reply.id;
    }

    await this.notService.create({
      receiverId: mentions,
      typeId: NotificationsIds.MENTION,
      message:
        type === 'POST'
          ? 'mencionou você em uma publicação'
          : 'mencionou você em um comentário',
      emitterId: userId,
      entity: {
        type: 'DEFAULT',
        postId: postId,
        replyId,
      },
    });
  }

  async findUsersById(id: string, type: 'POST' | 'REPLY' = 'POST') {
    const data = await this.mentionsRepo.findMany({
      where: {
        [type === 'POST' ? 'postId' : 'replyId']: id,
      },
      select: {
        user: {
          select: BASE_USER_SELECTOR,
        },
      },
    });

    type Mention = (typeof data)[0] & {
      user: BaseUser;
    };

    return (data as Mention[]).map((mention) => mention.user);
  }

  async getMentionableUsers(userId: string, content: string) {
    const friendIds = await this.friendsService.getUsersFriends(
      userId,
      false,
      true,
    );

    const friends: BaseUser[] = await this.usersRepo.findMany({
      where: {
        id: {
          in: friendIds,
        },
        username: {
          contains: content,
        },
      },
      select: BASE_USER_SELECTOR,
      take: PAGE_SIZE,
    });

    const mentionableUsers: BaseUser[] = await this.usersRepo.findMany({
      where: {
        id: {
          notIn: friendIds,
        },
        username: {
          contains: content,
        },
      },
      select: BASE_USER_SELECTOR,
      take: PAGE_SIZE - friends.length,
    });

    const mergedResults = [...friends, ...mentionableUsers].filter(
      (user) => user.id !== userId,
    );
    return mergedResults;
  }

  extract(content: string) {
    const regex = /@([a-fA-F0-9-]+)/g;
    const matches = content.match(regex);
    if (!matches) return [];
    return matches.map((mention) => mention.slice(1));
  }
}
