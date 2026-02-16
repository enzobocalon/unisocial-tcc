import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { AssignmentList } from 'src/modules/assignments/entities/assignments-list.entity';
import { PAGE_SIZE } from 'src/common/constants';

@Injectable()
export class AssignmentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.AssignmentsCreateArgs) {
    return this.prismaService.assignments.create(createDto);
  }

  findMany(findManyDto: Prisma.AssignmentsFindManyArgs) {
    return this.prismaService.assignments.findMany(findManyDto);
  }

  findUnique(findUniqueDto: Prisma.AssignmentsFindUniqueArgs) {
    return this.prismaService.assignments.findUnique(findUniqueDto);
  }

  findFirst(findFirstDto: Prisma.AssignmentsFindFirstArgs) {
    return this.prismaService.assignments.findFirst(findFirstDto);
  }

  delete(deleteDto: Prisma.AssignmentsDeleteArgs) {
    return this.prismaService.assignments.delete(deleteDto);
  }

  update(updateDto: Prisma.AssignmentsUpdateArgs) {
    return this.prismaService.assignments.update(updateDto);
  }

  getList(userId: string, page: number) {
    return this.prismaService.$queryRaw`
      WITH task_data AS (
          SELECT 
              a.id AS assignment_id,
              a.name AS assignment_name,
              a.icon AS assignment_icon,
              t.id AS task_id,
              t.name AS task_name,
              t.due_date AT TIME ZONE 'UTC' AS due_date,
              NOT atu.completed AS is_pending
          FROM assignments a
          JOIN assignments_users au ON a.id = au.assignment_id
          JOIN assignments_tasks t ON a.id = t.assignment_id
          LEFT JOIN assignments_tasks_users atu ON t.id = atu.task_id AND atu.user_id = au.id
          WHERE au.user_id = ${userId} AND atu.user_id = au.id
      ),
      grouped_task_counts AS (
          SELECT 
              assignment_id,
              assignment_name,
              assignment_icon,
              due_date,
              COUNT(task_id) FILTER (WHERE is_pending) AS pending_count
          FROM task_data
          WHERE due_date IS NOT NULL AND is_pending
          GROUP BY assignment_id, assignment_name, assignment_icon, due_date
      ),
      grouped_tasks AS (
    SELECT 
        ((due_date AT TIME ZONE 'America/Sao_Paulo')::date || ' 00:00:00')::timestamp AT TIME ZONE 'America/Sao_Paulo' AS "dueDate",
        false AS is_completed,
        json_agg(
            json_build_object(
                'id', assignment_id,
                'name', assignment_name,
                'icon', assignment_icon,
                'dueDate', due_date,
                'isPending', true,
                'pendingCount', pending_count
            ) ORDER BY due_date
        ) AS item
    FROM grouped_task_counts
    GROUP BY (due_date AT TIME ZONE 'America/Sao_Paulo')::date
    ORDER BY (due_date AT TIME ZONE 'America/Sao_Paulo')::date ASC
),
      completed_assignments AS (
          SELECT 
              '1970-01-01'::date AS "dueDate",
              true AS is_completed,
              json_agg(
                  json_build_object(
                      'id', a.id,
                      'name', a.name,
                      'icon', a.icon,
                      'dueDate', '1970-01-01',
                      'isPending', false,
                      'pendingCount', 0 -- Sempre 0 para completas
                  )
              ) AS item
          FROM assignments a
          JOIN assignments_users au ON a.id = au.assignment_id
          WHERE au.user_id = ${userId}
            AND NOT EXISTS (
                SELECT 1
                FROM assignments_tasks t
                LEFT JOIN assignments_tasks_users atu 
                ON t.id = atu.task_id AND atu.user_id = au.id
                WHERE t.assignment_id = a.id 
                  AND NOT atu.completed
            )
          GROUP BY 1970-01-01
      )
      SELECT *
      FROM grouped_tasks
      UNION ALL
      SELECT *
      FROM completed_assignments
      ORDER BY is_completed ASC, "dueDate" ASC
      LIMIT ${PAGE_SIZE}
      OFFSET ${page * PAGE_SIZE};

    ` as Promise<AssignmentList[]>;
  }
}
