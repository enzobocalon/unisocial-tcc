import { OnModuleInit } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { NotificationsTypesService } from '../services/notification-types.service';

@Resolver()
export class NotificationsTypesResolver implements OnModuleInit {
  constructor(private readonly notTypesService: NotificationsTypesService) {}
  async onModuleInit() {
    await this.notTypesService.init();
  }
}
