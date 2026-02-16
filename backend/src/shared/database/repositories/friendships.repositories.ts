import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FriendshipRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.FriendshipCreateArgs) {
    return this.prismaService.friendship.create(createDto);
  }

  findMany(findManyDto: Prisma.FriendshipFindManyArgs) {
    return this.prismaService.friendship.findMany(findManyDto);
  }

  findFirst(findFirstDto: Prisma.FriendshipFindFirstArgs) {
    return this.prismaService.friendship.findFirst(findFirstDto);
  }

  update(updateDto: Prisma.FriendshipUpdateArgs) {
    return this.prismaService.friendship.update(updateDto);
  }

  count(countDto: Prisma.FriendshipCountArgs) {
    return this.prismaService.friendship.count(countDto);
  }

  delete(deleteDto: Prisma.FriendshipDeleteArgs) {
    return this.prismaService.friendship.delete(deleteDto);
  }
}
