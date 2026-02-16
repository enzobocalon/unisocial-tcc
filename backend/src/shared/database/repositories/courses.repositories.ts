import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CourseRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createMany(createDto: Prisma.CourseCreateManyArgs) {
    return this.prismaService.course.createMany(createDto);
  }

  count(countDto?: Prisma.CourseCountArgs) {
    return this.prismaService.course.count(countDto);
  }

  findMany(findManyDto?: Prisma.CourseFindManyArgs) {
    return this.prismaService.course.findMany(findManyDto);
  }

  findFirst(findFirstDto: Prisma.CourseFindFirstArgs) {
    return this.prismaService.course.findFirst(findFirstDto);
  }
}
