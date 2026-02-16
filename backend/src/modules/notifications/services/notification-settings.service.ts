import { Injectable } from '@nestjs/common';
import { NotificationSettingRepository } from 'src/shared/database/repositories/notifications/notification-settings.repositories';

@Injectable()
export class NotificationSettingsService {
  constructor(
    private readonly notificationSettingsRepo: NotificationSettingRepository,
  ) {}

  async canReceiveNotifications(userId: string[], postId: string) {
    if (!postId) return null;
    const validUsersIds = userId.filter((id) => typeof id === 'string');

    const settings = await this.notificationSettingsRepo.findMany({
      where: {
        userId: {
          in: validUsersIds,
        },
        postId,
      },
    });

    const filteredUsers = validUsersIds.filter((user) => {
      const userSettings = settings.find((setting) => setting.userId === user);

      if (!userSettings) {
        return true;
      }

      return userSettings.enabled;
    });

    return filteredUsers;
  }

  async disable(userId: string, postId: string) {
    const data = await this.notificationSettingsRepo.create({
      data: {
        enabled: false,
        postId,
        userId,
      },
    });

    if (!data) {
      return {
        success: false,
        message: 'Erro ao desabilitar notificações.',
      };
    }

    return {
      success: true,
      message: 'Notificações desabilitadas com sucesso.',
    };
  }

  async enable(userId: string, postId: string) {
    const setting = await this.notificationSettingsRepo.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (!setting) {
      return {
        success: false,
        message: 'Erro ao habilitar notificações.',
      };
    }

    await this.notificationSettingsRepo.update({
      where: {
        id: setting.id,
      },
      data: {
        enabled: true,
      },
    });

    return {
      success: true,
      message: 'Notificações habilitadas com sucesso.',
    };
  }
}
