import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssignmentTaskFileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.AssignmentsTasksFilesCreateArgs) {
    return this.prismaService.assignmentsTasksFiles.create(createDto);
  }

  createMany(createManyDto: Prisma.AssignmentsTasksFilesCreateManyArgs) {
    return this.prismaService.assignmentsTasksFiles.createMany(createManyDto);
  }

  findUnique(findUniqueDto: Prisma.AssignmentsTasksFilesFindUniqueArgs) {
    return this.prismaService.assignmentsTasksFiles.findUnique(findUniqueDto);
  }

  findMany(findManyDto: Prisma.AssignmentsTasksFilesFindManyArgs) {
    return this.prismaService.assignmentsTasksFiles.findMany(findManyDto);
  }

  findFirst(findFirstDto: Prisma.AssignmentsTasksFilesFindFirstArgs) {
    return this.prismaService.assignmentsTasksFiles.findFirst(findFirstDto);
  }

  update(updateDto: Prisma.AssignmentsTasksFilesUpdateArgs) {
    return this.prismaService.assignmentsTasksFiles.update(updateDto);
  }

  delete(deleteDto: Prisma.AssignmentsTasksFilesDeleteArgs) {
    return this.prismaService.assignmentsTasksFiles.delete(deleteDto);
  }

  deleteMany(deleteManyDto: Prisma.AssignmentsTasksFilesDeleteManyArgs) {
    return this.prismaService.assignmentsTasksFiles.deleteMany(deleteManyDto);
  }
}
