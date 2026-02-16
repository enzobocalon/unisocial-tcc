import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class NotificationObjectRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create(createDto: Prisma.NotificationObjectCreateArgs) {
    return this.prismaService.notificationObject.create(createDto);
  }

  delete(deleteDto: Prisma.NotificationObjectDeleteArgs) {
    return this.prismaService.notificationObject.delete(deleteDto);
  }

  deleteMany(deleteManyDto: Prisma.NotificationObjectDeleteManyArgs) {
    return this.prismaService.notificationObject.deleteMany(deleteManyDto);
  }
}
