import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LikeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.LikeCreateArgs) {
    return this.prismaService.like.create(createDto);
  }

  count(countDto: Prisma.LikeCountArgs) {
    return this.prismaService.like.count(countDto);
  }

  findMany(findManyDto: Prisma.LikeFindManyArgs) {
    return this.prismaService.like.findMany(findManyDto);
  }

  findFirst(findFirstDto: Prisma.LikeFindFirstArgs) {
    return this.prismaService.like.findFirst(findFirstDto);
  }

  delete(deleteDto: Prisma.LikeDeleteArgs) {
    return this.prismaService.like.delete(deleteDto);
  }
}
