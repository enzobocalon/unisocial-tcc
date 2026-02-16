import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.PostCreateArgs) {
    return this.prismaService.post.create(createDto);
  }

  count(countDto: Prisma.PostCountArgs) {
    return this.prismaService.post.count(countDto);
  }

  update(updateDto: Prisma.PostUpdateArgs) {
    return this.prismaService.post.update(updateDto);
  }

  updateMany(updateManyDto: Prisma.PostUpdateManyArgs) {
    return this.prismaService.post.updateMany(updateManyDto);
  }

  findMany(findManyDto: Prisma.PostFindManyArgs) {
    return this.prismaService.post.findMany(findManyDto);
  }

  findUnique(findUniqueDto: Prisma.PostFindUniqueArgs) {
    return this.prismaService.post.findUnique(findUniqueDto);
  }

  findFirst(findFirstDto: Prisma.PostFindFirstArgs) {
    return this.prismaService.post.findFirst(findFirstDto);
  }

  deleteMany(deleteManyDto: Prisma.PostDeleteManyArgs) {
    return this.prismaService.post.deleteMany(deleteManyDto);
  }

  delete(deleteDto: Prisma.PostDeleteArgs) {
    return this.prismaService.post.delete(deleteDto);
  }
}
