import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageStatusRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.MessageStatusCreateArgs) {
    return this.prismaService.messageStatus.create(createDto);
  }

  createMany(createManyDto: Prisma.MessageStatusCreateManyArgs) {
    return this.prismaService.messageStatus.createMany(createManyDto);
  }

  findUnique(findUniqueDto: Prisma.MessageStatusFindUniqueArgs) {
    return this.prismaService.messageStatus.findUnique(findUniqueDto);
  }

  updateMany(updateManyDto: Prisma.MessageStatusUpdateManyArgs) {
    return this.prismaService.messageStatus.updateMany(updateManyDto);
  }

  update(updateDto: Prisma.MessageUpdateArgs) {
    return this.prismaService.message.update(updateDto);
  }

  findMany(findManyDto: Prisma.MessageStatusFindManyArgs) {
    return this.prismaService.messageStatus.findMany(findManyDto);
  }

  delete(deleteDto: Prisma.MessageStatusDeleteArgs) {
    return this.prismaService.messageStatus.delete(deleteDto);
  }
}
