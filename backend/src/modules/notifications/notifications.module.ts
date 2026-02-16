import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { NotificationsObjectsService } from './services/notification-objects.service';
import { NotificationsTypesService } from './services/notification-types.service';
import { NotificationsResolver } from './resolvers/notifications.resolver';
import { NotificationsTypesResolver } from './resolvers/notification-types.resolver';
import { NotificationSettingsService } from './services/notification-settings.service';
@Global()
@Module({
  providers: [
    NotificationsResolver,
    NotificationsTypesResolver,
    NotificationsService,
    NotificationsObjectsService,
    NotificationsTypesService,
    NotificationSettingsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
