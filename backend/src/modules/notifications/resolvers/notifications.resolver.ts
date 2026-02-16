import {
  Args,
  Mutation,
  Resolver,
  Query,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { NotificationsService } from '../services/notifications.service';
import { ResponseEntity } from 'src/entities/response.entity';
import { NotificationSettingsService } from '../services/notification-settings.service';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { Notification } from '../entities/notification.entity';

@Resolver()
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notSetting: NotificationSettingsService,
  ) {}

  @Mutation(() => ResponseEntity, {
    name: 'disableNotifications',
    description: 'Disable notifications from a post',
  })
  async disableNotifications(
    @Args('postId') postId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.notSetting.disable(userId, postId);
  }

  @Mutation(() => ResponseEntity, {
    name: 'enableNotifications',
    description: 'Enable notifications from a post',
  })
  async enableNotifications(
    @Args('postId') postId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.notSetting.enable(userId, postId);
  }

  @Query(() => [Notification], {
    name: 'getNotifications',
    description: 'Get all notifications from active user',
  })
  async getNotifications(
    @ActiveUserId() userId: string,
    @Args('page') page: number,
  ) {
    return this.notificationsService.getNotifications(userId, page);
  }

  @Query(() => [Notification], {
    name: 'getFriendRequests',
    description: 'Get all friend requests from active user',
  })
  async getFriendRequests(
    @ActiveUserId() userId: string,
    @Args('page') page: number,
  ) {
    return this.notificationsService.getFriendRequests(userId, page);
  }

  @Query(() => Int, {
    name: 'unreadNotifications',
    description: 'Get all unread notifications count',
  })
  async unreadNotifications(@ActiveUserId() userId: string) {
    return this.notificationsService.unreadNotifications(userId);
  }

  @Subscription(() => Notification, {
    name: 'notifications',
    description: 'Subscribes to notifications socket',
  })
  async notifications(@ActiveUserId() userId: string) {
    return this.notificationsService.notifications(userId);
  }

  // Testar subscriptions. Será removido
  @Query(() => Notification)
  testNotification(@ActiveUserId() userId: string) {
    return this.notificationsService.testNotification(userId);
  }
}
