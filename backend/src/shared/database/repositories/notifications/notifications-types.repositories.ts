import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationTypeRepository {
  constructor(private readonly prismaService: PrismaService) {}
  createMany(createDto: Prisma.NotificationTypeCreateManyArgs) {
    return this.prismaService.notificationType.createMany(createDto);
  }

  async count(countDto?: Prisma.NotificationTypeCountArgs) {
    return this.prismaService.notificationType.count(countDto);
  }
}
