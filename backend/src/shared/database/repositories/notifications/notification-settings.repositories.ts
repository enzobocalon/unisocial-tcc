import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class NotificationSettingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.NotificationSettingCreateArgs) {
    return this.prismaService.notificationSetting.create(createDto);
  }

  delete(deleteDto: Prisma.NotificationSettingDeleteArgs) {
    return this.prismaService.notificationSetting.delete(deleteDto);
  }

  findMany(findDto: Prisma.NotificationSettingFindManyArgs) {
    return this.prismaService.notificationSetting.findMany(findDto);
  }

  findFirst(findDto: Prisma.NotificationSettingFindFirstArgs) {
    return this.prismaService.notificationSetting.findFirst(findDto);
  }

  update(updateDto: Prisma.NotificationSettingUpdateArgs) {
    return this.prismaService.notificationSetting.update(updateDto);
  }
}
