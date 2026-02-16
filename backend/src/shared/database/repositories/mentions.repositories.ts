import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MentionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.MentionsCreateArgs) {
    return this.prismaService.mentions.create(createDto);
  }

  createMany(createManyDto: Prisma.MentionsCreateManyArgs) {
    return this.prismaService.mentions.createMany(createManyDto);
  }

  findMany(findManyDto: Prisma.MentionsFindManyArgs) {
    return this.prismaService.mentions.findMany(findManyDto);
  }

  deleteMany(deleteManyDto: Prisma.MentionsDeleteManyArgs) {
    return this.prismaService.mentions.deleteMany(deleteManyDto);
  }
}
