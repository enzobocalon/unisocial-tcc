import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MediaRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.MediaCreateArgs) {
    return this.prismaService.media.create(createDto);
  }

  createMany(createManyDto: Prisma.MediaCreateManyArgs) {
    return this.prismaService.media.createMany(createManyDto);
  }

  findUnique(findUniqueDto: Prisma.MediaFindUniqueArgs) {
    return this.prismaService.media.findUnique(findUniqueDto);
  }

  findFirst(findFirstDto: Prisma.MediaFindFirstArgs) {
    return this.prismaService.media.findFirst(findFirstDto);
  }

  findMany(findManyDto: Prisma.MediaFindManyArgs) {
    return this.prismaService.media.findMany(findManyDto);
  }

  delete(deleteDto: Prisma.MediaDeleteArgs) {
    return this.prismaService.media.delete(deleteDto);
  }

  updateMany(updateManyDto: Prisma.MediaUpdateManyArgs) {
    return this.prismaService.media.updateMany(updateManyDto);
  }
}
