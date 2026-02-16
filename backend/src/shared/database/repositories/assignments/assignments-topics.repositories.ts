import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { PAGE_SIZE } from 'src/common/constants';

@Injectable()
export class AssignmentTaskUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.AssignmentsTasksUsersCreateArgs) {
    return this.prismaService.assignmentsTasksUsers.create(createDto);
  }

  createMany(createManyDto: Prisma.AssignmentsTasksUsersCreateManyArgs) {
    return this.prismaService.assignmentsTasksUsers.createMany(createManyDto);
  }

  findUnique(findUniqueDto: Prisma.AssignmentsTasksUsersFindUniqueArgs) {
    return this.prismaService.assignmentsTasksUsers.findUnique(findUniqueDto);
  }

  findMany(findManyDto: Prisma.AssignmentsTasksUsersFindManyArgs) {
    return this.prismaService.assignmentsTasksUsers.findMany(findManyDto);
  }

  findFirst(findFirstDto: Prisma.AssignmentsTasksUsersFindFirstArgs) {
    return this.prismaService.assignmentsTasksUsers.findFirst(findFirstDto);
  }

  update(updateDto: Prisma.AssignmentsTasksUsersUpdateArgs) {
    return this.prismaService.assignmentsTasksUsers.update(updateDto);
  }

  delete(deleteDto: Prisma.AssignmentsTasksUsersDeleteArgs) {
    return this.prismaService.assignmentsTasksUsers.delete(deleteDto);
  }

  deleteMany(deleteManyDto: Prisma.AssignmentsTasksUsersDeleteManyArgs) {
    return this.prismaService.assignmentsTasksUsers.deleteMany(deleteManyDto);
  }

  count(countDto: Prisma.AssignmentsTasksUsersCountArgs) {
    return this.prismaService.assignmentsTasksUsers.count(countDto);
  }

  getTaskMembers(taskId: string, page: number) {
    return this.prismaService.$queryRaw`
      WITH Counts AS (
          SELECT 
              task_id,
              COUNT(*) AS "totalCount",
              COUNT(CASE WHEN completed = true THEN 1 END) AS "completedCount"
          FROM assignments_tasks_users
          WHERE task_id = ${taskId}
          GROUP BY task_id
      )
      SELECT 
          c."completedCount",
          c."totalCount",
          COALESCE(JSON_AGG(
              JSON_BUILD_OBJECT(
                  'id', atu.id,
                  'taskId', atu.task_id,
                  'userId', atu.user_id,
                  'completed', atu.completed,
                  'name', u.name,
                  'username', u.username,
                  'avatar', u.avatar
              )
          ) FILTER (WHERE atu.id IS NOT NULL), '[]') AS users
      FROM users u
      JOIN assignments_users au ON u.id = au.user_id
      LEFT JOIN assignments_tasks_users atu ON atu.user_id = au.id 
      LEFT JOIN Counts c ON atu.task_id = c.task_id 
      WHERE atu.task_id = ${taskId}
      GROUP BY c."totalCount", c."completedCount"
      LIMIT ${PAGE_SIZE} OFFSET ${PAGE_SIZE * page};
    `;
  }
}
