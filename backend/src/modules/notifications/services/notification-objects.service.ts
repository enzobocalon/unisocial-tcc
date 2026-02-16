import { Injectable } from '@nestjs/common';
import { NotificationObjectRepository } from 'src/shared/database/repositories/notifications/notifications-objects.repositories';
import { NotificationObjectDTO } from '../dto/create-notification-object.dto';

@Injectable()
export class NotificationsObjectsService {
  constructor(
    private readonly notificationObjectRepo: NotificationObjectRepository,
  ) {}

  async create(
    emitterId: string,
    typeId: number,
    message?: string,
    entity?: NotificationObjectDTO,
  ) {
    if (!emitterId || !typeId) return;

    const data = await this.notificationObjectRepo.create({
      data: {
        emitterId,
        typeId,
        message,
        postId: entity.postId,
        replyId: entity.replyId,
        friendshipId: entity.friendshipId,
        assignmentId: entity.assignmentId,
        taskId: entity.taskId,
      },
    });

    return data;
  }

  async delete(id: string) {
    return this.notificationObjectRepo.delete({
      where: {
        id,
      },
    });
  }

  async deleteMany(ids: string[]) {
    return this.notificationObjectRepo.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
