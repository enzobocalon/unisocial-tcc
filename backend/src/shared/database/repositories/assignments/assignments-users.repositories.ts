import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssignmentUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.AssignmentsUsersCreateArgs) {
    return this.prismaService.assignmentsUsers.create(createDto);
  }

  update(updateDto: Prisma.AssignmentsUsersUpdateArgs) {
    return this.prismaService.assignmentsUsers.update(updateDto);
  }

  findMany(findManyDto: Prisma.AssignmentsUsersFindManyArgs) {
    return this.prismaService.assignmentsUsers.findMany(findManyDto);
  }

  findFirst(findUniqueDto: Prisma.AssignmentsUsersFindFirstArgs) {
    return this.prismaService.assignmentsUsers.findFirst(findUniqueDto);
  }

  createMany(createManyDto: Prisma.AssignmentsUsersCreateManyArgs) {
    return this.prismaService.assignmentsUsers.createMany(createManyDto);
  }

  deleteMany(deleteManyDto: Prisma.AssignmentsUsersDeleteManyArgs) {
    return this.prismaService.assignmentsUsers.deleteMany(deleteManyDto);
  }

  delete(deleteDto: Prisma.AssignmentsUsersDeleteArgs) {
    return this.prismaService.assignmentsUsers.delete(deleteDto);
  }
}
