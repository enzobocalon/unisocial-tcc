import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatUsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ChatUserCreateArgs) {
    return this.prismaService.chatUser.create(createDto);
  }

  findFirst(findFirstDto: Prisma.ChatUserFindFirstArgs) {
    return this.prismaService.chatUser.findFirst(findFirstDto);
  }

  findMany(findManyDto: Prisma.ChatUserFindManyArgs) {
    return this.prismaService.chatUser.findMany(findManyDto);
  }

  update(updateDto: Prisma.ChatUserUpdateArgs) {
    return this.prismaService.chatUser.update(updateDto);
  }

  delete(deleteDto: Prisma.ChatUserDeleteArgs) {
    return this.prismaService.chatUser.delete(deleteDto);
  }
}
