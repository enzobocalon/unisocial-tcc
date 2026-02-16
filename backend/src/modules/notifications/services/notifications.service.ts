import { Injectable } from '@nestjs/common';
import { NotificationsObjectsService } from './notification-objects.service';
import { NotificationRepository } from 'src/shared/database/repositories/notifications/notifications.repositories';
import { CreateNotificationDTO } from '../dto/create-notification.dto';
import { NotificationSettingsService } from './notification-settings.service';
import { Prisma } from '@prisma/client';
import { Notification } from '../entities/notification.entity';
import { RedisPubSubService } from 'src/shared/redis/pubSub/pubSub.service';
import { BASE_USER_SELECTOR, PAGE_SIZE } from 'src/common/constants';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Reply } from 'src/modules/replies/entities/reply.entity';
import { UtilsService } from 'src/shared/utils/utils.service';
import { NotificationObjectDTO } from '../dto/create-notification-object.dto';

const includedItems = {
  notificationObject: {
    include: {
      post: {
        select: {
          content: true,
          mentions: {
            select: {
              user: {
                select: BASE_USER_SELECTOR,
              },
            },
          },
        },
      },
      reply: {
        select: {
          content: true,
          postId: true,
          mentions: {
            select: {
              user: {
                select: BASE_USER_SELECTOR,
              },
            },
          },
        },
      },
      emitter: {
        select: BASE_USER_SELECTOR,
      },
      type: {
        select: {
          defaultMessage: true,
          id: true,
          name: true,
        },
      },
    },
  },
};

type NotificationInclude = Prisma.NotificationGetPayload<{
  include: typeof includedItems;
}>;
@Injectable()
export class NotificationsService {
  constructor(
    private readonly notObjService: NotificationsObjectsService,
    private readonly notificationRepo: NotificationRepository,
    private readonly notSettings: NotificationSettingsService,
    private readonly pubSub: RedisPubSubService,
    private readonly utilsService: UtilsService,
  ) {}

  async create(data: CreateNotificationDTO) {
    const {
      receiverId,
      emitterId,
      message,
      notificationObjectId,
      typeId,
      entity,
    } = data;
    if (!receiverId) {
      throw new Error('ReceiverId is required');
    }
    let objectId = notificationObjectId || null;

    const possibleReceivers =
      (await this.notSettings.canReceiveNotifications(
        receiverId,
        entity.postId || null,
      )) || [];

    if (!possibleReceivers.length && entity.postId) return;

    if (!objectId) {
      if (!emitterId && !typeId) {
        throw new Error('Missing properties: emitterId and typeId');
      }

      const object = await this.notObjService.create(
        emitterId,
        typeId,
        message,
        entity,
      );
      objectId = object.id;
    }

    // Previnir spam de notificações iguais!
    const existingNotifications = await Promise.all(
      receiverId.map((receiver) =>
        this.findSimilarNotification(receiver, emitterId, entity),
      ),
    );

    const validNotifications = existingNotifications.filter(Boolean);

    if (validNotifications.length > 0) {
      await this.notificationRepo.deleteMany({
        where: {
          id: { in: validNotifications.map((n) => n.id) },
        },
      });

      const notificationObjectIds = [
        ...new Set(validNotifications.map((n) => n.notificationObjectId)),
      ];

      const remainingCounts = await this.notificationRepo.count({
        where: {
          notificationObjectId: { in: notificationObjectIds },
        },
      });

      if (remainingCounts === 0) {
        await this.notObjService.deleteMany(notificationObjectIds);
      }
    }

    const notifications = (
      possibleReceivers.length ? possibleReceivers : receiverId
    ).map((receiver) => {
      return {
        receiverId: receiver,
        notificationObjectId: objectId,
      };
    });

    const rawData = await this.notificationRepo.createMany(notifications);
    const hasFriendship = rawData.some(
      (n) =>
        n.notificationObject.type.name === 'Friendship' ||
        n.notificationObject.friendshipId,
    );
    const datas = this.merger(rawData as NotificationInclude[], hasFriendship);
    for (const data of datas) {
      await this.pubSub.publish(`notifications:${receiverId}`, {
        notifications: data,
      });
    }
  }

  async delete(notificationId: string, shouldDeleteObject: boolean = false) {
    const deletedNotification = await this.notificationRepo.delete({
      where: {
        id: notificationId,
      },
    });
    if (shouldDeleteObject) {
      await this.notObjService.delete(deletedNotification.notificationObjectId);
    }
  }

  async getNotifications(userId: string, page: number) {
    const notifications = (await this.notificationRepo.findMany({
      where: {
        receiverId: userId,
        notificationObject: {
          type: {
            NOT: {
              id: 1, // Friendship
            },
          },
        },
      },
      include: includedItems,
      orderBy: {
        createdAt: 'desc',
      },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    })) as NotificationInclude[];

    await this.notificationRepo.updateMany({
      where: {
        receiverId: userId,
      },
      data: {
        status: 'READ',
      },
    });

    return this.merger(notifications);
  }

  async getFriendRequests(userId: string, page: number) {
    const notifications = (await this.notificationRepo.findMany({
      where: {
        receiverId: userId,
        notificationObject: {
          typeId: 1, // Friendship
        },
      },
      include: includedItems,
      orderBy: {
        createdAt: 'desc',
      },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    })) as NotificationInclude[];

    await this.notificationRepo.updateMany({
      where: {
        id: {
          in: notifications.map((notification) => notification.id),
        },
      },
      data: {
        status: 'READ',
      },
    });

    return this.merger(notifications, true);
  }

  async unreadNotifications(userId: string) {
    return await this.notificationRepo.count({
      where: {
        receiverId: userId,
        status: 'UNREAD',
      },
    });
  }

  async notifications(userId: string) {
    return this.pubSub.asyncIterator(`notifications:${userId}`);
  }

  private merger(notifications: NotificationInclude[], isFriendship = false) {
    if (isFriendship) {
      const mergedNotifications = notifications.map((notification) => {
        const mergedNotification: Notification = {
          id: notification.id,
          emitters: [notification.notificationObject.emitter],
          postId: notification.notificationObject?.postId,
          replyId: notification.notificationObject?.replyId,
          typeId: notification.notificationObject.typeId,
          type: notification.notificationObject.type,
          message:
            notification.notificationObject.message ||
            notification.notificationObject.type.defaultMessage,
          friendshipId: notification.notificationObject.friendshipId,
          status: notification.status,
          createdAt: notification.createdAt.toString(),
        };
        return mergedNotification;
      });
      return mergedNotifications;
    }
    const groupedNotifications: { [key: string]: NotificationInclude[] } = {};

    notifications.forEach((notification) => {
      const type = notification.notificationObject.type.name;
      if (type === 'Friendship') return; // fallback
      const id = `${notification.notificationObject?.postId}${
        notification.notificationObject.replyId ? '_REPLY' : '_POST'
      }`;
      const key = `${type}_${id}`;

      if (groupedNotifications[key]) {
        groupedNotifications[key].push(notification);
      } else {
        groupedNotifications[key] = [notification];
      }
    });

    const mergedNotifications = Object.values(groupedNotifications).map(
      (group) => {
        const mergedNotification: Notification = {
          id: group[0].id, // 0 é o primeiro item do array e o mais recente, visto que o array está ordenado por createdAt desc.
          emitters: Array.from(
            new Map(
              group.map((item) => [
                item.notificationObject.emitter.id,
                item.notificationObject.emitter,
              ]),
            ).values(),
          ),
          postId:
            group[0].notificationObject?.postId ||
            group[0].notificationObject?.reply?.postId,
          replyId: group[0].notificationObject?.replyId,
          taskId: group[0].notificationObject?.taskId,
          assignmentId: group[0].notificationObject?.assignmentId,
          typeId: group[0].notificationObject.typeId,
          type: group[0].notificationObject.type,
          message:
            group[0].notificationObject.message ||
            group[0].notificationObject.type.defaultMessage,
          friendshipId: group[0].notificationObject?.friendshipId,
          status: group[0].status,
          createdAt: group[0].createdAt.toString(),
          post: group[0].notificationObject.post?.content
            ? ({
                content: this.utilsService.contentParser(
                  group[0].notificationObject.post?.content,
                  group[0].notificationObject.post?.mentions.map(
                    (mention) => mention.user,
                  ),
                ),
                mentions: group[0].notificationObject?.post?.mentions,
              } as Post)
            : (group[0].notificationObject.post as Post),
          reply: group[0].notificationObject.reply?.content
            ? ({
                content: this.utilsService.contentParser(
                  group[0].notificationObject.reply?.content,
                  group[0].notificationObject.reply?.mentions.map(
                    (mention) => mention.user,
                  ),
                ),
                mentions: group[0].notificationObject?.reply?.mentions,
              } as unknown as Reply)
            : (group[0].notificationObject?.reply as unknown as Reply),
        };
        return mergedNotification;
      },
    );

    return this.parseMessage(mergedNotifications);
  }

  private parseMessage(notifications: Notification[]) {
    return notifications.map((notification) => {
      if (notification.emitters.length === 1) return notification;
      const type = notification.typeId;
      switch (type) {
        case 2:
          notification.message = notification.message.replace(
            'respondeu',
            'responderam',
          );
          return notification;
        case 3:
          notification.message = notification.message.replace(
            'curtiu',
            'curtiram',
          );
          return notification;
        case 4:
          notification.message = notification.message.replace(
            'compartilhou',
            'compartilharam',
          );
          return notification;
        default:
          return notification;
      }
    });
  }

  async testNotification(userId: string) {
    const notification: Notification = {
      emitters: [
        {
          id: '1',
          name: 'Teste',
          username: 'teste',
          avatar: 'teste',
        },
      ],
      id: '1',
      message: 'teste',
      status: 'UNREAD',
      type: {
        name: 'teste de tipo',
        defaultMessage: 'teste',
      },
      typeId: 2,
      postId: '1',
      createdAt: new Date().toString(),
    };
    await this.pubSub.publish(`notifications:${userId}`, {
      notifications: notification,
    });
    return notification;
  }

  private async findSimilarNotification(
    receiverId: string,
    emitterId: string,
    entity: NotificationObjectDTO,
  ) {
    return this.notificationRepo.findFirst({
      where: {
        receiverId,
        notificationObject: {
          OR: [
            { postId: entity.postId },
            { replyId: entity.replyId },
            { friendshipId: entity.friendshipId },
            { assignmentId: entity.assignmentId },
            { taskId: entity.taskId },
          ],
          emitterId,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}

// https://medium.com/@sujoy.swe/building-real-time-notifications-with-graphql-subscriptions-and-redis-pubsub-in-nestjs-ed13916dfac1
