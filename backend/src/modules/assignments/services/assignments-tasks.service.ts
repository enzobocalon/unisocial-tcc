import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAssignmentTaskDTO } from '../dto/create-assignment-task.dto';
import { AssignmentRepository } from 'src/shared/database/repositories/assignments/assignments.repositories';
import { Prisma } from '@prisma/client';
import { AssignmentTaskRepository } from 'src/shared/database/repositories/assignments/assignments-tasks.repositories';
import { UpdateAssignmentTaskDTO } from '../dto/update-assignment-task.dto';
import { RedisPubSubService } from 'src/shared/redis/pubSub/pubSub.service';
import { AssignmentUserRepository } from 'src/shared/database/repositories/assignments/assignments-users.repositories';
import { AssignmentTaskUserRepository } from 'src/shared/database/repositories/assignments/assignments-topics.repositories';
import { UserTaskDTO } from '../dto/users-task.dto';
import { UsersService } from 'src/modules/users/users.service';
import { UploadFileToTaskDTO } from '../dto/upload-file-to-task.dto';
import { AssignmentTaskFileRepository } from 'src/shared/database/repositories/assignments/assignments-tasks-files.repositories';
import { NotificationsService } from 'src/modules/notifications/services/notifications.service';
import { NotificationsIds, PAGE_SIZE } from 'src/common/constants';
import { UploadService } from 'src/modules/upload/upload.service';
import { TaskUsersIds } from '../entities/task-sub.entity';
import { ResponseEntity } from 'src/entities/response.entity';

const includedAssignmentUsers = {
  user: {
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
    },
  },
};

type IncludedAssignmentUsers = Prisma.AssignmentsUsersGetPayload<{
  include: typeof includedAssignmentUsers;
}>;

const includedMembers = {
  user: {
    include: {
      user: {
        select: {
          id: true,
          avatar: true,
          name: true,
          username: true,
        },
      },
    },
  },
};

type IncludedMembers = Prisma.AssignmentsTasksUsersGetPayload<{
  include: typeof includedMembers;
}>;

const includedAssignments = {
  assignmentsUsers: {
    select: {
      isAdmin: true,
      id: true,
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
    },
  },
};

type IncludedAssignments = Prisma.AssignmentsGetPayload<{
  include: typeof includedAssignments;
}>;

const includedTasks = {
  assignment: {
    select: {
      id: true,
      ownerId: true,
      assignmentsUsers: {
        select: {
          user: {
            select: {
              id: true,
            },
          },
          isAdmin: true,
        },
      },
    },
  },
  owner: {
    select: {
      avatar: true,
      username: true,
      name: true,
      id: true,
    },
  },
};

type IncludedTasks = Prisma.AssignmentsTasksGetPayload<{
  include: typeof includedTasks;
}>;

const includedFiles = {
  user: {
    select: {
      id: true,
      user: {
        select: {
          name: true,
          id: true,
          avatar: true,
          username: true,
        },
      },
    },
  },
};

type IncludedFiles = Prisma.AssignmentsTasksFilesGetPayload<{
  include: typeof includedFiles;
}>;

@Injectable()
export class AssignmentsTasksService {
  constructor(
    private readonly assignmentsRepo: AssignmentRepository,
    private readonly assignmentTaskRepo: AssignmentTaskRepository,
    private readonly pubSub: RedisPubSubService,
    private readonly assignmentsUsersRepo: AssignmentUserRepository,
    private readonly taskUsersRepo: AssignmentTaskUserRepository,
    private readonly fileRepo: AssignmentTaskFileRepository,
    private readonly usersService: UsersService,
    private readonly notService: NotificationsService,
    private readonly assignmentTaskUser: AssignmentTaskUserRepository,
    private readonly uploadService: UploadService,
  ) {}

  async createAssignmentTask(data: CreateAssignmentTaskDTO, userId: string) {
    const { assignmentId, name, description, dueDate, users } = data;
    const assignment = (await this.assignmentsRepo.findUnique({
      where: {
        id: assignmentId,
      },
      include: includedAssignments,
    })) as IncludedAssignments;

    if (!assignment) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    const isOwner = assignment.ownerId === userId;
    const isAdmin = assignment.assignmentsUsers.some(
      (user) => user.user.id === userId && user.isAdmin,
    );

    if (!isOwner && !isAdmin) {
      throw new UnauthorizedException(
        'Você não tem permissão para criar tarefas.',
      );
    }

    const task = (await this.assignmentTaskRepo.create({
      data: {
        assignmentId,
        name,
        description,
        dueDate,
        ownerId: userId, // Quem criou a tarefa
      },
      include: includedTasks,
    })) as IncludedTasks;

    if (users) {
      await this.addUsersToTask(
        {
          taskId: task.id,
          userIds: users,
        },
        userId,
      );
    }

    await this.sendSubscription(task, 'CREATE');

    return task;
  }

  async updateAssignmentTask(data: UpdateAssignmentTaskDTO, userId: string) {
    const { taskId, description, dueDate, name } = data;

    const task = (await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
      include: includedTasks,
    })) as IncludedTasks;

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const isOwner =
      task.ownerId === userId || task.assignment.ownerId === userId;
    const isAdmin = task.assignment.assignmentsUsers.some(
      (user) => user.user.id === userId && user.isAdmin,
    );

    if (!isOwner && !isAdmin) {
      throw new UnauthorizedException(
        'Você não tem permissão para editar essa tarefa.',
      );
    }

    const updatedTask = (await this.assignmentTaskRepo.update({
      where: {
        id: taskId,
      },
      data: {
        description: description || undefined,
        dueDate: dueDate || undefined,
        name: name || undefined,
      },
      include: includedTasks,
    })) as IncludedTasks;

    await this.sendSubscription(updatedTask, 'UPDATE');

    return updatedTask;
  }

  async addUsersToTask(data: UserTaskDTO, userId: string) {
    const { taskId, userIds } = data;

    const task = (await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
      include: includedTasks,
    })) as IncludedTasks;

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const isOwner =
      task.ownerId === userId || task.assignment.ownerId === userId;
    const isAdmin = task.assignment.assignmentsUsers.some(
      (user) => user.user.id === userId && user.isAdmin,
    );

    if (!isOwner && !isAdmin) {
      throw new UnauthorizedException(
        'Você não tem permissão para adicionar usuários a essa tarefa.',
      );
    }

    const users = await this.assignmentsUsersRepo.findMany({
      where: {
        id: {
          in: userIds,
        },
        assignmentId: task.assignment.id,
      },
    });

    const usersIds = users.map((user) => ({
      id: user.id,
      userId: user.userId,
    }));
    const alreadyMembers = (await this.taskUsersRepo.findMany({
      where: {
        taskId,
        userId: {
          in: usersIds.map((user) => user.id),
        },
      },
      include: includedMembers,
    })) as IncludedMembers[];

    const membersToBeAdded = usersIds.filter(
      (item) => !alreadyMembers.some((member) => member.userId === item.id),
    );

    if (membersToBeAdded.length === 0) {
      throw new ForbiddenException('Nenhum usuário foi adicionado.');
    }

    const usersToBeAdded = membersToBeAdded.map((item) => ({
      userId: item.id,
      taskId,
    }));

    await this.taskUsersRepo.createMany({
      data: usersToBeAdded,
    });

    const membersSet = new Set(membersToBeAdded);
    const receiverIds: string[] = users.reduce((acc, user) => {
      if (
        membersSet.has({
          id: user.id,
          userId: user.userId,
        }) &&
        user.userId !== userId
      ) {
        acc.push(user.userId);
      }
      return acc;
    }, []);

    await this.notService.create({
      receiverId: receiverIds,
      emitterId: userId,
      typeId: NotificationsIds.TASK,
      entity: {
        assignmentId: task.assignment.id,
        taskId: task.id,
        type: 'DEFAULT',
      },
    });

    await this.sendSubscription(
      task,
      'JOIN',
      membersToBeAdded.map((item) => ({ id: 'JOIN', userId: item.userId })),
    );

    return {
      success: true,
      message: 'Usuários adicionados com sucesso.',
    };
  }

  async leaveTask(taskId: string, userId: string) {
    const task = (await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
      include: includedTasks,
    })) as IncludedTasks;

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const user = await this.taskUsersRepo.findFirst({
      where: {
        taskId,
        user: {
          userId,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Você não faz parte dessa tarefa.');
    }

    await this.taskUsersRepo.delete({
      where: {
        id: user.id,
      },
    });

    await this.sendSubscription(task, 'LEAVE', [
      {
        userId: userId,
        id: user.id,
      },
    ]);

    return {
      success: true,
      message: 'Você saiu da tarefa.',
    };
  }

  async removeUsersFromTask(data: UserTaskDTO, userId: string) {
    const { taskId, userIds } = data;
    const task = (await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
      include: includedTasks,
    })) as IncludedTasks;

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const isOwner =
      task.ownerId === userId || task.assignment.ownerId === userId;
    const isAdmin = task.assignment.assignmentsUsers.some(
      (user) => user.user.id === userId && user.isAdmin,
    );
    if (!isOwner && !isAdmin) {
      throw new UnauthorizedException(
        'Você não tem permissão para remover usuários dessa tarefa.',
      );
    }

    const users = await this.assignmentsUsersRepo.findMany({
      where: {
        assignmentId: task.assignment.id,
        id: {
          in: userIds,
        },
      },
    });

    const deletedUsers = await this.taskUsersRepo.deleteMany({
      where: {
        userId: {
          in: users.map((user) => user.id),
        },
        taskId,
      },
    });

    if (deletedUsers.count === 0) {
      return {
        success: false,
        message: 'Nenhum usuário foi removido.',
      };
    }

    await this.sendSubscription(
      task,
      'REMOVE_USER',
      users.map((user) => {
        return {
          userId: user.userId,
          id: user.id,
        };
      }),
    );
    return {
      success: true,
      message: 'Usuários removidos com sucesso.',
    };
  }

  async deleteAssignmentTask(taskId: string, userId: string) {
    const task = (await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
      include: includedTasks,
    })) as IncludedTasks;

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const isOwner =
      task.ownerId === userId || task.assignment.ownerId === userId;
    const isAdmin = task.assignment.assignmentsUsers.some(
      (user) => user.user.id === userId && user.isAdmin,
    );

    if (!isOwner && !isAdmin) {
      throw new UnauthorizedException(
        'Você não tem permissão para deletar essa tarefa.',
      );
    }

    const files = await this.fileRepo.findMany({
      where: {
        taskId,
      },
    });

    for (const file of files) {
      this.uploadService.deleteFromDisk(file.url);
    }

    await this.assignmentTaskRepo.delete({
      where: {
        id: taskId,
      },
    });

    await this.sendSubscription(task, 'DELETE');

    return {
      success: true,
      message: 'Tarefa apagada com sucesso.',
    };
  }

  async deleteFile(fileUrl: string, userId: string, taskId: string) {
    type User = Prisma.AssignmentsUsersGetPayload<unknown> & {
      assignment?: {
        ownerId: string;
      };
    };

    type File = Prisma.AssignmentsTasksFilesGetPayload<unknown>;

    const [user, file]: [User | null, File | null] = await Promise.all([
      this.assignmentsUsersRepo.findFirst({
        where: {
          userId, // ID real do User
          assignment: {
            assignmentsTasks: {
              some: {
                id: taskId, // mesma task do arquivo
              },
            },
          },
        },
        include: {
          assignment: {
            select: { ownerId: true },
          },
        },
      }),
      this.fileRepo.findFirst({
        where: {
          url: fileUrl,
          taskId,
        },
        include: {
          user: true,
        },
      }),
    ]);

    if (!user || !file) {
      throw new NotFoundException('Arquivo não encontrado.');
    }

    const isAdmin = user.isAdmin;
    const isFileOwner = file.userId === user.id;
    const isOwner = user.assignment.ownerId === user.id;

    if (!isAdmin && !isFileOwner && !isOwner) {
      throw new UnauthorizedException(
        'Você não tem permissão para apagar esse arquivo.',
      );
    }

    const deletedFile = await this.fileRepo.delete({
      where: {
        id: file.id,
      },
    });

    if (!deletedFile) {
      throw new NotFoundException('Arquivo não encontrado.');
    }

    const files = await this.fileRepo.findMany({
      where: {
        taskId,
        userId: user.id,
      },
    });

    const hasRemainingFiles = files.length > 0;

    const isUserTaskMember = await this.taskUsersRepo.findFirst({
      where: {
        taskId,
        userId: user.id,
      },
    });

    if (!hasRemainingFiles && isUserTaskMember) {
      await this.tagTaskAsCompleted(taskId, userId, false);
    }

    // const task = (await this.assignmentTaskRepo.findUnique({
    //   where: {
    //     id: taskId,
    //   },
    //   include: includedTasks,
    // })) as IncludedTasks;

    await this.uploadService.deleteFromDisk(fileUrl);
    // await this.sendSubscription(task, 'FILE');

    return {
      success: true,
      message: 'Arquivo apagado com sucesso.',
    };
  }

  async uploadFiles(
    data: UploadFileToTaskDTO,
    userId: string,
  ): Promise<ResponseEntity> {
    const { files, taskId } = data;

    const originalTask = (await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
      include: includedTasks,
    })) as IncludedTasks;

    if (!originalTask) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const member = await this.assignmentsUsersRepo.findFirst({
      where: {
        assignmentId: originalTask.assignment.id,
        userId,
      },
    });

    const isAdmin = await this.assignmentsUsersRepo.findFirst({
      where: {
        assignmentId: originalTask.assignment.id,
        userId,
        isAdmin: true,
      },
    });
    const isOwner =
      originalTask.ownerId === userId ||
      originalTask.assignment.ownerId === userId;

    if (!member && !isAdmin && !isOwner) {
      throw new UnauthorizedException(
        'Você não tem permissão para adicionar arquivos a essa tarefa.',
      );
    }

    const createdFiles = [];

    for (const file of files) {
      const createdFile = await this.fileRepo.create({
        data: {
          filename: file.filename,
          taskId,
          userId: member.id,
          url: file.url,
          type: file.type,
        },
      });
      createdFiles.push(createdFile);
    }

    const taskMembers = (await this.assignmentTaskUser.findMany({
      where: {
        taskId,
      },
      include: includedMembers,
    })) as IncludedMembers[];
    const tasksUsers = taskMembers.map((member) => member.user.userId);
    this.notService.create({
      receiverId: tasksUsers.filter((user) => user !== userId),
      emitterId: userId,
      typeId: NotificationsIds.TASK,
      entity: {
        assignmentId: originalTask.assignment.id,
        taskId: originalTask.id,
        type: 'DEFAULT',
      },
      message: 'adicionou arquivos à tarefa.',
    });

    const isUserTaskMember = await this.taskUsersRepo.findFirst({
      where: {
        taskId,
        userId: member.id,
      },
    });

    if (isUserTaskMember) {
      await this.tagTaskAsCompleted(originalTask.id, userId, true);
    }

    // await this.sendSubscription(originalTask, 'FILE');

    return {
      success: true,
      message: 'Arquivos enviados com sucesso.',
    };
  }

  async tasks(userId: string) {
    return this.pubSub.asyncIterator(`tasks:${userId}`);
  }

  async getUsersTaskByAssignmentId(
    assignmentId: string,
    userId: string,
    page: number,
  ) {
    const isUserMember = await this.assignmentsUsersRepo.findFirst({
      where: {
        userId,
        assignmentId,
      },
    });

    if (!isUserMember) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    const tasks = await this.assignmentTaskRepo.getUsersTasksByAssignment(
      assignmentId,
      userId,
      page,
    );

    return tasks;
  }

  async getAllTasksByAssignmentId(
    assignmentId: string,
    userId: string,
    page: number,
  ) {
    const isUserMember = await this.assignmentsUsersRepo.findFirst({
      where: {
        userId,
        assignmentId,
      },
    });

    if (!isUserMember) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    const tasks = await this.assignmentTaskRepo.getAllTasksByAssignment(
      assignmentId,
      userId,
      page,
    );

    return tasks;
  }

  async getTask(taskId: string, userId: string) {
    const task = (await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
      include: includedTasks,
    })) as IncludedTasks;

    const assignmentMember = await this.assignmentsUsersRepo.findFirst({
      where: {
        userId,
      },
    });

    if (!assignmentMember || !task) {
      throw new NotFoundException('Atividade ou tarefa não encontrada.');
    }

    const files = await this.fileRepo.findMany({
      where: {
        taskId,
        user: {
          userId,
        },
      },
    });

    const user = await this.taskUsersRepo.findFirst({
      where: {
        taskId,
        user: {
          userId,
        },
      },
    });

    const completedCount = await this.taskUsersRepo.count({
      where: {
        taskId,
        completed: true,
      },
    });

    const totalCount = await this.taskUsersRepo.count({
      where: {
        taskId,
      },
    });

    const taskWithFiles = {
      ...task,
      isMember: !!user,
      completed: user?.completed || false,
      files: files || [],
      completedCount: completedCount || 0,
      totalCount: totalCount || 0,
    };

    return taskWithFiles;
  }

  async getTaskMembers(taskId: string, page: number, userId: string) {
    const task = await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const isUserMember = await this.assignmentsUsersRepo.findFirst({
      where: {
        assignmentId: task.assignmentId,
        userId,
      },
    });

    if (!isUserMember) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const members = (await this.assignmentTaskUser.findMany({
      where: {
        taskId,
      },
      include: includedMembers,
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    })) as IncludedMembers[];

    // Por página, retorna no máximo 10.
    return members.map((i) => {
      return {
        ...i,
        user: i.user.user,
      };
    });
  }

  async getCategorizedTaskUsers(
    assignmentId: string,
    userId: string,
    page: number,
    query?: string,
  ) {
    const assignment = await this.assignmentsRepo.findUnique({
      where: {
        id: assignmentId,
      },
    });
    if (!assignment) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    const userMember = await this.assignmentsUsersRepo.findFirst({
      where: {
        assignmentId,
        userId,
      },
    });

    if (!userMember && assignment.ownerId !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para adicionar usuários a essa tarefa.',
      );
    }

    const assignmentUsers = (await this.assignmentsUsersRepo.findMany({
      where: {
        assignmentId,
        user: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
      orderBy: {
        user: {
          username: 'asc',
        },
      },
      include: includedAssignmentUsers,
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    })) as IncludedAssignmentUsers[];

    const categorizedFriends = Object.entries(
      assignmentUsers.reduce(
        (acc, friend) => {
          const initial = friend.user.name.charAt(0).toUpperCase();
          if (!acc[initial]) {
            acc[initial] = [];
          }
          acc[initial].push(friend);
          return acc;
        },
        {} as Record<string, IncludedAssignmentUsers[]>,
      ),
    ).map(([letter, friends]) => ({ letter, friends }));
    return {
      data: categorizedFriends,
      hasNextPage: assignmentUsers.length >= PAGE_SIZE,
    };
  }

  async getAddableTaskUsers(
    assignmentId: string,
    taskId: string,
    userId: string,
    page: number,
  ) {
    const users = await this.getCategorizedTaskUsers(
      assignmentId,
      userId,
      page,
    );

    const taskUsers = await this.taskUsersRepo.findMany({
      where: {
        taskId,
      },
    });

    const userIds = new Set(taskUsers.map((member) => member.userId));

    const categorizedFriendsWithMembership = users.data.map((category) => ({
      ...category,
      friends: category.friends.map((friend) => ({
        ...friend,
        isMember: userIds.has(friend.id), // Verifica se o amigo já é membro
      })),
    }));

    return {
      ...users,
      count: taskUsers.length,
      data: categorizedFriendsWithMembership,
    };
  }

  async searchAddableTaskUsers(
    assignmentId: string,
    taskId: string,
    userId: string,
    query: string,
    page: number,
  ) {
    const users = await this.getCategorizedTaskUsers(
      assignmentId,
      userId,
      page,
      query,
    );

    const taskUsers = await this.taskUsersRepo.findMany({
      where: {
        taskId,
      },
    });

    const userIds = new Set(taskUsers.map((member) => member.userId));

    const categorizedFriendsWithMembership = users.data.map((category) => ({
      ...category,
      friends: category.friends.map((friend) => ({
        ...friend,
        isMember: userIds.has(friend.id), // Verifica se o amigo já é membro
      })),
    }));

    return {
      ...users,
      data: categorizedFriendsWithMembership,
    };
  }

  async tagTaskAsCompleted(
    taskId: string,
    userId: string,
    completedStatus: boolean | null = null,
  ) {
    const task = (await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
      include: includedTasks,
    })) as IncludedTasks;

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const user = await this.taskUsersRepo.findFirst({
      where: {
        taskId,
        user: {
          userId,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Você não faz parte dessa tarefa.');
    }

    if (user.completed && !completedStatus) {
      const hasFiles = await this.fileRepo.findMany({
        where: {
          taskId,
          user: {
            userId,
          },
        },
      });

      if (hasFiles.length > 0) {
        throw new ForbiddenException(
          'Remova os arquivos da tarefa antes de desmarcar como concluída.',
        );
      }
    }

    const data = await this.assignmentTaskUser.update({
      where: {
        id: user.id,
      },
      data: {
        completed: completedStatus || !user.completed,
      },
    });

    await this.sendSubscription(
      task,
      data.completed ? 'COMPLETE' : 'INCOMPLETE',
      [
        {
          userId,
          id: user.id,
        },
      ],
    );

    return {
      success: true,
      message: 'Tarefa marcada como concluída.',
    };
  }

  async getAllFiles(taskId: string, userId: string, page: number) {
    const isAssignmentMember = await this.assignmentsUsersRepo.findFirst({
      where: {
        userId,
      },
    });
    if (!isAssignmentMember) {
      throw new NotFoundException('Atividade não encontrada.');
    }
    const task = await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const files = (await this.fileRepo.findMany({
      where: {
        taskId,
      },
      orderBy: {
        user: {
          user: {
            name: 'asc',
          },
        },
      },
      include: includedFiles,
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    })) as IncludedFiles[];

    const groupedByUser = files.reduce((acc, file) => {
      const userId = file.user.id;

      if (!acc[userId]) {
        acc[userId] = {
          user: {
            id: file.user.id,
            user: {
              id: file.user.user.id,
              name: file.user.user.name,
              username: file.user.user.username,
              avatar: file.user.user.avatar,
            },
          },
          files: [],
        };
      }

      acc[userId].files.push({
        id: file.id,
        filename: file.filename,
        url: file.url,
        type: file.type,
      });

      return acc;
    }, {});

    const result = Object.values(groupedByUser);
    return result;
  }

  async searchFilesByUser(
    taskId: string,
    userId: string,
    query: string,
    page: number,
  ) {
    const isAssignmentMember = await this.assignmentsUsersRepo.findFirst({
      where: {
        userId,
      },
    });
    if (!isAssignmentMember) {
      throw new NotFoundException('Atividade não encontrada.');
    }
    const task = await this.assignmentTaskRepo.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const files = (await this.fileRepo.findMany({
      where: {
        taskId,
        user: {
          user: {
            OR: [
              {
                name: {
                  contains: query,
                },
              },
              {
                username: {
                  contains: query,
                },
              },
            ],
          },
        },
      },
      orderBy: {
        user: {
          user: {
            name: 'asc',
          },
        },
      },
      include: includedFiles,
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    })) as IncludedFiles[];

    const groupedByUser = files.reduce((acc, file) => {
      const userId = file.user.id;

      if (!acc[userId]) {
        acc[userId] = {
          user: {
            id: file.user.id,
            user: {
              id: file.user.user.id,
              name: file.user.user.name,
              username: file.user.user.username,
              avatar: file.user.user.avatar,
            },
          },
          files: [],
        };
      }

      acc[userId].files.push({
        id: file.id,
        filename: file.filename,
        url: file.url,
        type: file.type,
      });

      return acc;
    }, {});

    const result = Object.values(groupedByUser);
    return result;
  }

  private async sendSubscription(
    task: IncludedTasks,
    action: string,
    ids?: TaskUsersIds[],
  ) {
    const assignmentUsers = task.assignment.assignmentsUsers.map(
      (user) => user.user.id,
    );
    const onlineStatusPromises = assignmentUsers.map(async (user) => {
      const isUserOnline = await this.usersService.isUserOnline(user);
      return { user: user, isOnline: isUserOnline };
    });

    const onlineUsers = await Promise.all(onlineStatusPromises);

    await Promise.all(
      onlineUsers
        .filter((user) => user.isOnline)
        .map((user) =>
          this.pubSub.publish(`tasks:${user.user}`, {
            tasks: {
              assignment: task.assignment,
              task: {
                ...task,
                dueDate: task.dueDate ? task.dueDate.toISOString() : null,
              },
              action,
              ids,
            },
          }),
        ),
    );
  }
}
