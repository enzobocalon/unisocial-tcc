import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReplyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ReplyCreateArgs) {
    return this.prismaService.reply.create(createDto);
  }

  update(updateDto: Prisma.ReplyUpdateArgs) {
    return this.prismaService.reply.update(updateDto);
  }

  findMany(findManyDto: Prisma.ReplyFindManyArgs) {
    return this.prismaService.reply.findMany(findManyDto);
  }

  findUnique(findUniqueDto: Prisma.ReplyFindUniqueArgs) {
    return this.prismaService.reply.findUnique(findUniqueDto);
  }

  findFirst(findFirstDto: Prisma.ReplyFindFirstArgs) {
    return this.prismaService.reply.findFirst(findFirstDto);
  }

  delete(deleteDto: Prisma.ReplyDeleteArgs) {
    return this.prismaService.reply.delete(deleteDto);
  }
}
