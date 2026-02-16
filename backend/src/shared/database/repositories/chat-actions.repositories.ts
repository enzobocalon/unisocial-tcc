import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatActionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ChatActionsCreateArgs) {
    return this.prismaService.chatActions.create(createDto);
  }

  findMany(findManyDto: Prisma.ChatActionsFindManyArgs) {
    return this.prismaService.chatActions.findMany(findManyDto);
  }
}
