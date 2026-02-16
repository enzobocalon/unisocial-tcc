import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { PAGE_SIZE } from 'src/common/constants';

@Injectable()
export class AssignmentTaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.AssignmentsTasksCreateArgs) {
    return this.prismaService.assignmentsTasks.create(createDto);
  }

  findUnique(findUniqueDto: Prisma.AssignmentsTasksFindUniqueArgs) {
    return this.prismaService.assignmentsTasks.findUnique(findUniqueDto);
  }

  findMany(findManyDto: Prisma.AssignmentsTasksFindManyArgs) {
    return this.prismaService.assignmentsTasks.findMany(findManyDto);
  }

  update(updateDto: Prisma.AssignmentsTasksUpdateArgs) {
    return this.prismaService.assignmentsTasks.update(updateDto);
  }

  delete(deleteDto: Prisma.AssignmentsTasksDeleteArgs) {
    return this.prismaService.assignmentsTasks.delete(deleteDto);
  }

  getUsersTasksByAssignment(
    assignmentId: string,
    userId: string,
    page: number,
  ) {
    return this.prismaService.$queryRaw`
        WITH task_data AS (
        SELECT 
            t.id AS task_id,
            t.name AS task_name,
            t.due_date AT TIME ZONE 'UTC' AS due_date,
            t.description AS description,
            NOT atu.completed AS is_pending
        FROM assignments a
        JOIN assignments_users au ON a.id = au.assignment_id
        JOIN assignments_tasks t ON a.id = t.assignment_id
        LEFT JOIN assignments_tasks_users atu ON t.id = atu.task_id AND atu.user_id = au.id
        WHERE au.user_id = ${userId} AND atu.user_id = au.id
        AND a.id = ${assignmentId}
    ),
    grouped_pending_tasks AS (
    SELECT 
        MIN(due_date) AS "dueDate",  -- Pega o primeiro timestamp do grupo
        false AS is_completed,
        json_agg(
            json_build_object(
                'id', task_id,
                'name', task_name,
                'dueDate', due_date,  -- Mantém o timestamp completo de cada tarefa
                'isPending', is_pending,
                'description', description
            ) ORDER BY due_date
        ) AS item
    FROM task_data
    WHERE due_date IS NOT NULL AND is_pending
    GROUP BY (due_date AT TIME ZONE 'America/Sao_Paulo')::date  -- Agrupa pelo dia na timezone local
    ORDER BY (due_date AT TIME ZONE 'America/Sao_Paulo')::date ASC
),
    completed_tasks AS (
        SELECT 
            '1970-01-01'::date AS "dueDate",
            true AS is_completed,
            json_agg(
                json_build_object(
                    'id', t.id,
                    'name', t.name,
                    'dueDate', t.due_date AT TIME ZONE 'UTC',
                    'isPending', false,
                    'description', description
                ) ORDER BY t.due_date
            ) AS item
        FROM assignments a
      JOIN assignments_users au ON a.id = au.assignment_id
        JOIN assignments_tasks t ON a.id = t.assignment_id
      LEFT JOIN assignments_tasks_users atu ON t.id = atu.task_id AND atu.user_id = au.id
        WHERE a.id = ${assignmentId} AND au.user_id = ${userId}
          AND atu.completed = true
    )
    SELECT *
    FROM grouped_pending_tasks
    UNION ALL
    SELECT *
    FROM completed_tasks
    WHERE item IS NOT NULL
    ORDER BY is_completed ASC, "dueDate" ASC
    LIMIT ${PAGE_SIZE}
    OFFSET ${page * PAGE_SIZE};

    `;
  }

  getAllTasksByAssignment(assignmentId: string, userId: string, page: number) {
    return this.prismaService.$queryRaw`
        WITH task_data AS (
        SELECT DISTINCT ON (t.id)
            t.id AS task_id,
            t.name AS task_name,
            t.due_date AT TIME ZONE 'UTC' AS due_date,
            t.description AS description,
            NOT COALESCE(atu.completed, false) AS is_pending
        FROM assignments a
        JOIN assignments_users au ON a.id = au.assignment_id
        JOIN assignments_tasks t ON a.id = t.assignment_id
        LEFT JOIN assignments_tasks_users atu ON t.id = atu.task_id
        WHERE a.id = ${assignmentId}
    ),
    grouped_pending_tasks AS (
        SELECT 
            MIN(due_date) AS "dueDate",
            json_agg(
                json_build_object(
                    'id', task_id,
                    'name', task_name,
                    'dueDate', due_date,
                    'isPending', is_pending,
                    'description', description
                ) ORDER BY due_date
            ) AS item
        FROM task_data
        GROUP BY (due_date AT TIME ZONE 'America/Sao_Paulo')::date
        ORDER BY (due_date AT TIME ZONE 'America/Sao_Paulo')::date ASC
    )
    SELECT *
    FROM grouped_pending_tasks
    WHERE item IS NOT NULL
    ORDER BY "dueDate" ASC
    LIMIT ${PAGE_SIZE}
    OFFSET ${page * PAGE_SIZE};

    `;
  }
}
