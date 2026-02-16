import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotificationTypeRepository } from 'src/shared/database/repositories/notifications/notifications-types.repositories';

@Injectable()
export class NotificationsTypesService {
  constructor(private readonly notTypeRepo: NotificationTypeRepository) {}
  async init() {
    const count = await this.notTypeRepo.count();
    if (count > 0) return;
    console.log('Seeding Notification Types...');
    const notificationTypesData: Prisma.NotificationTypeCreateManyInput[] = [
      {
        id: 1,
        name: 'Friendship',
        defaultMessage: 'enviou uma notificação de amizade',
      },
      {
        id: 2,
        name: 'Reply',
        defaultMessage: 'respondeu sua publicação',
      },
      {
        id: 3,
        name: 'Like',
        defaultMessage: 'curtiu sua publicação',
      },
      {
        id: 4,
        name: 'Share',
        defaultMessage: 'compartilhou sua publicação',
      },
      {
        id: 5,
        name: 'Message',
        defaultMessage: 'enviou uma mensagem',
      },
      {
        id: 6,
        name: 'Mention',
        defaultMessage: 'mencionou você em uma publicação',
      },
      {
        id: 7,
        name: 'Assignment',
        defaultMessage: 'adicionou você a uma atividade',
      },
      {
        id: 8,
        name: 'Task',
        defaultMessage: 'atribuiu uma tarefa a você',
      },
      {
        id: 999,
        name: 'System',
        defaultMessage: null,
      },
    ];

    await this.notTypeRepo.createMany({
      data: notificationTypesData,
    });
  }
}
