import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AssignmentRepository } from 'src/shared/database/repositories/assignments/assignments.repositories';
import { CreateAssignmentDTO } from '../dto/create-assignment.dto';
import { FriendshipsService } from 'src/modules/friendships/friendships.service';
import { AssignmentUserRepository } from 'src/shared/database/repositories/assignments/assignments-users.repositories';
import { Prisma } from '@prisma/client';
import { UpdateUserAssignmentDTO } from '../dto/update-user-assignment.dto';
import { UploadService } from 'src/modules/upload/upload.service';
import { UpdateAssignmentDTO } from '../dto/update-assignment.dto';
import { RedisPubSubService } from 'src/shared/redis/pubSub/pubSub.service';
import { UsersService } from 'src/modules/users/users.service';
import { NotificationsService } from 'src/modules/notifications/services/notifications.service';
import {
  BASE_USER_SELECTOR,
  NotificationsIds,
  PAGE_SIZE,
} from 'src/common/constants';
import { ResponseEntity } from 'src/entities/response.entity';
import { ChatRepository } from 'src/shared/database/repositories/chats.repositories';
import { Assignment } from '../entities/assignment.entity';
import { AssignmentSub } from '../entities/assignment-sub.entity';
import { AssignmentUserSub } from '../entities/assignment-user-sub.entity';

const includedItems = {
  assignmentsUsers: {
    select: {
      isAdmin: true,
      id: true,
      userId: true,
      assignmentId: true,
      createdAt: true,
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
  chat: {
    select: {
      id: true,
      name: true,
    },
  },
};

const includedUser = {
  user: {
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
    },
  },
};

type IncludedUser = Prisma.AssignmentsUsersGetPayload<{
  include: typeof includedUser;
}>;

type IncludedAssignments = Prisma.AssignmentsGetPayload<{
  include: typeof includedItems;
}>;

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly assignmentRepo: AssignmentRepository,
    private readonly friendshipService: FriendshipsService,
    private readonly assignmentUserRepo: AssignmentUserRepository,
    private readonly uploadService: UploadService,
    private readonly pubSubService: RedisPubSubService,
    private readonly usersService: UsersService,
    private readonly notService: NotificationsService,
    private readonly chatRepository: ChatRepository,
  ) {}

  async canNavigateBetweenAssignmentAndChat(
    userId: string,
    chatId: string,
    assignmentId: string,
  ): Promise<ResponseEntity> {
    const includedItems = {
      assignments: {
        where: { id: assignmentId },
        select: { id: true },
      },
      chatUser: {
        where: { userId },
        select: { id: true },
      },
    };

    type IncludedItems = Prisma.ChatGetPayload<{
      include: typeof includedItems;
    }>;

    // Consulta combinada para buscar chat, atividade e associações do usuário
    const chatWithDetails = (await this.chatRepository.findFirst({
      where: { id: chatId },
      include: {
        assignments: {
          where: { id: assignmentId },
          select: { id: true },
        },
        chatUser: {
          where: { userId },
          select: { id: true },
        },
      },
    })) as IncludedItems;

    if (!chatWithDetails) {
      throw new NotFoundException('Chat não encontrado');
    }

    if (chatWithDetails.assignments.length === 0) {
      throw new ForbiddenException(
        'Esta atividade não está vinculada a este chat.',
      );
    }

    if (chatWithDetails.chatUser.length === 0) {
      throw new UnauthorizedException(
        'Você não é membro deste chat. Peça para algum administrador te adicionar.',
      );
    }

    const assignmentMembership = await this.assignmentUserRepo.findFirst({
      where: { assignmentId, userId },
      select: { id: true },
    });

    if (!assignmentMembership) {
      throw new UnauthorizedException(
        'Você não é membro desta atividade. Peça para algum administrador te adicionar.',
      );
    }

    return {
      success: true,
      message: 'Permissão concedida.',
    };
  }

  async createAssignment(data: CreateAssignmentDTO, userId: string) {
    const { name, icon, usersIds: userIdsRaw } = data;
    if (userIdsRaw.length > 49) {
      throw new BadRequestException(
        'Limite de usuários excedidos. Máximo: 50 usuários por grupo',
      );
    }
    const assignment = (await this.assignmentRepo.create({
      data: {
        name,
        ownerId: userId,
        icon,
      },
      include: includedItems,
    })) as IncludedAssignments;

    const usersIds = [...userIdsRaw, userId];

    if (usersIds.length) {
      await this.addUsersToAssignment(assignment.id, usersIds, userId, true);
    }

    return assignment;
  }

  async addUsersToAssignment(
    assignmentId: string,
    usersIds: string[],
    userId: string,
    shouldIncludeSelf = false,
    shouldSendSub = true,
  ) {
    const assignment = (await this.assignmentRepo.findUnique({
      where: {
        id: assignmentId,
      },
      include: includedItems,
    })) as IncludedAssignments;

    if (!assignment) {
      return {
        message: 'Atividade não encontrada.',
        success: false,
      };
    }

    const isOwner = assignment.ownerId === userId;
    const isAdmin = assignment.assignmentsUsers.some(
      (user) => user.user.id === userId && user.isAdmin,
    );

    if (!isOwner && !isAdmin) {
      return {
        message:
          'Você não tem permissão para adicionar usuários a esta atividade.',
        success: false,
      };
    }

    const friends = await this.friendshipService.getUsersFriends(
      userId,
      shouldIncludeSelf,
      false,
    );
    const validUsers = usersIds.filter((id) => friends.includes(id));
    if (validUsers.length) {
      const existingMembers = await this.assignmentUserRepo.findMany({
        select: {
          id: true,
        },
        where: {
          assignmentId,
          userId: {
            in: usersIds.map((id) => id),
          },
        },
      });

      const existingMemberIds = existingMembers.map((member) => member.userId);
      const newValidUsers = validUsers.filter(
        (id) => !existingMemberIds.includes(id),
      );
      if (newValidUsers.length) {
        const newMembers = newValidUsers.map((userId) => ({
          assignmentId,
          userId,
          isAdmin: userId === assignment.ownerId,
        }));

        const users = await this.assignmentUserRepo.createMany({
          data: newMembers,
        });

        if (users.count > 0) {
          if (shouldSendSub) {
            const usersToBeSentIds = newMembers.map((member) => member.userId);
            await this.sendSubscription(
              {
                assignment: {
                  ...assignment,
                  isAdmin: false,
                  createdAt: assignment.createdAt.toISOString(),
                },
                member: null,
                action: 'JOIN',
              },
              usersToBeSentIds,
            );
            await this.sendMemberSubscription({
              assignment: {
                ...assignment,
                isAdmin: null,
                createdAt: assignment.createdAt.toISOString(),
              },
              member: null,
              action: 'JOIN',
            });
          }
          await this.notService.create({
            receiverId: newMembers
              .map((member) => member.userId)
              .filter((id) => id !== userId),
            emitterId: userId,
            typeId: NotificationsIds.ASSIGNMENT,
            entity: {
              type: 'DEFAULT',
              assignmentId,
            },
          });
          return {
            message: 'Usuários adicionados com sucesso.',
            success: true,
          };
        }
        return {
          message: 'Nenhum usuário adicionado.',
          success: false,
        };
      }
    }
    return {
      message: 'Nenhum usuário válido a ser adicionado.',
      success: false,
    };
  }

  async leaveAssignment(assignmentId: string, userId: string) {
    const assignment = (await this.assignmentRepo.findUnique({
      where: {
        id: assignmentId,
      },
      include: includedItems,
    })) as IncludedAssignments;
    if (!assignment) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    if (assignment.ownerId === userId) {
      throw new ForbiddenException(
        'Passe a liderança a outra pessoa antes de sair',
      );
    }

    const user = (await this.assignmentUserRepo.findFirst({
      where: {
        assignmentId,
        userId,
      },
      include: includedUser,
    })) as IncludedUser;

    const deletedUser = await this.assignmentUserRepo.delete({
      where: {
        id: user.id,
      },
    });

    await this.sendMemberSubscription({
      assignment: {
        ...assignment,
        isAdmin: null,
        createdAt: assignment.createdAt.toISOString(),
      },
      member: user,
      action: 'LEAVE',
    });
    await this.sendSubscription(
      {
        assignment: {
          ...assignment,
          isAdmin: null,
          createdAt: assignment.createdAt.toISOString(),
        },
        member: user,
        action: 'LEAVE',
      },
      [user.userId],
    );

    if (deletedUser) {
      return {
        message: 'Você saiu da atividade com sucesso.',
        success: true,
      };
    }
  }

  async removeUsersFromAssignment(
    assignmentId: string,
    userIdToRemove: string,
    userId: string,
    isLeaving = false,
  ) {
    const assignment = (await this.assignmentRepo.findUnique({
      where: {
        id: assignmentId,
      },
      include: includedItems,
    })) as IncludedAssignments & Assignment;

    if (!assignment) {
      return {
        message: 'Atividade não encontrada.',
        success: false,
      };
    }

    if (assignment.ownerId === userIdToRemove) {
      throw new ForbiddenException(
        'Você não pode remover o dono da atividade.',
      );
    }

    const isOwner = assignment.ownerId === userId;
    const isAdmin = assignment.assignmentsUsers.some(
      (user) => user.user.id === userId && user.isAdmin,
    );

    if (!isLeaving && !isOwner && !isAdmin) {
      return {
        message:
          'Você não tem permissão para remover usuários desta atividade.',
        success: false,
      };
    }

    const assignmentUser = await this.assignmentUserRepo.findFirst({
      where: {
        assignmentId,
        userId: userIdToRemove,
      },
    });

    if (!assignmentUser) {
      return {
        message: 'Usuário não encontrado.',
        success: false,
      };
    }

    const user = (await this.assignmentUserRepo.delete({
      where: {
        id: assignmentUser.id,
      },
      include: includedUser,
    })) as IncludedUser;

    if (user) {
      await this.sendMemberSubscription({
        assignment: {
          ...assignment,
          isAdmin: null,
          createdAt: assignment.createdAt.toISOString(),
        },
        member: user,
        action: 'LEAVE',
      });
      await this.sendSubscription(
        {
          assignment: {
            ...assignment,
            isAdmin: null,
            createdAt: assignment.createdAt.toISOString(),
          },
          member: user,
          action: 'LEAVE',
        },
        [user.userId],
      );
      return {
        message: 'Usuários removidos com sucesso.',
        success: true,
      };
    }
    return {
      message: 'Nenhum usuário removido.',
      success: false,
    };
  }

  async updateUserRoleInAssignment(
    data: UpdateUserAssignmentDTO,
    ownerId: string,
  ) {
    const { assignmentId, userId, isAdmin } = data;
    const assignment = await this.assignmentRepo.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (assignment.ownerId !== ownerId) {
      return {
        message: 'Você não tem permissão para alterar o cargo deste usuário.',
        success: false,
      };
    }

    const user = await this.assignmentUserRepo.findFirst({
      where: {
        assignmentId,
        userId,
      },
    });

    if (!user) {
      return {
        message: 'Usuário não encontrado.',
        success: false,
      };
    }

    if (user.isAdmin === isAdmin) {
      return {
        message: 'Usuário já possui esse cargo.',
        success: false,
      };
    }

    const updatedUser = (await this.assignmentUserRepo.update({
      where: {
        id: user.id,
      },
      data: {
        isAdmin,
      },
      include: includedUser,
    })) as IncludedUser;

    if (updatedUser) {
      await this.sendSubscription(
        {
          assignment: {
            ...assignment,
            isAdmin: updatedUser.isAdmin,
            createdAt: assignment.createdAt.toISOString(),
          },
          member: updatedUser,
          action: 'UPDATE',
        },
        [user.userId],
      );
      await this.sendMemberSubscription({
        assignment: {
          ...assignment,
          isAdmin: null,
          createdAt: assignment.createdAt.toISOString(),
        },
        member: updatedUser,
        action: 'UPDATE',
      });
      return {
        message: 'Cargo do usuário alterado com sucesso.',
        success: true,
      };
    }
    return {
      message: 'Cargo do usuário não alterado.',
      success: false,
    };
  }

  async transferOwnership(
    assignmentId: string,
    userId: string,
    newOwnerId: string,
  ) {
    const isOwner = await this.assignmentRepo.findFirst({
      where: {
        id: assignmentId,
        ownerId: userId,
      },
    });

    if (!isOwner) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    const user = await this.assignmentUserRepo.findFirst({
      where: {
        assignmentId,
        userId: newOwnerId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const assignment = await this.assignmentRepo.update({
      where: {
        id: assignmentId,
      },
      data: {
        ownerId: newOwnerId,
      },
    });

    const updatedUser = (await this.assignmentUserRepo.update({
      where: {
        id: user.id,
      },
      data: {
        isAdmin: true,
      },
      include: includedUser,
    })) as IncludedUser;

    // enviar sub membros
    await this.sendMemberSubscription({
      assignment: {
        ...assignment,
        isAdmin: null,
        createdAt: assignment.createdAt.toISOString(),
      },
      member: updatedUser,
      action: 'TRANSFER',
    });
    await this.sendSubscription(
      {
        assignment: {
          ...assignment,
          isAdmin: true,
          createdAt: assignment.createdAt.toISOString(),
        },
        member: updatedUser,
        action: 'TRANSFER',
      },
      [user.userId],
    );
    return {
      message: 'Liderança transferida com sucesso.',
      success: true,
    };
  }

  async deleteAssignment(assignmentId: string, userId: string) {
    const assignment = await this.assignmentRepo.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (!assignment) {
      return {
        message: 'Atividade não encontrada.',
        success: false,
      };
    }

    if (assignment.ownerId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir esta atividade.',
      );
    }

    const deletedAssignment = (await this.assignmentRepo.delete({
      where: {
        id: assignmentId,
      },
      include: includedItems,
    })) as IncludedAssignments;

    if (deletedAssignment) {
      this.uploadService.deleteFromDisk(assignment.icon);
      const users = deletedAssignment.assignmentsUsers.map(
        (user) => user.userId,
      );
      await this.sendSubscription(
        {
          assignment: {
            ...deletedAssignment,
            isAdmin: null,
            createdAt: deletedAssignment.createdAt.toISOString(),
          },
          member: null,
          action: 'DELETE',
        },
        users,
      );
      return {
        message: 'Atividade excluída com sucesso.',
        success: true,
      };
    }
    return {
      message: 'Falha ao apagar a atividade.',
      success: false,
    };
  }

  async updateAssignment(data: UpdateAssignmentDTO, userId: string) {
    const { id, icon, name } = data;

    const assignment = (await this.assignmentRepo.findUnique({
      where: {
        id,
      },
      include: includedItems,
    })) as IncludedAssignments;

    if (!assignment) {
      return {
        message: 'Atividade não encontrada.',
        success: false,
      };
    }

    const isOwner = assignment.ownerId === userId;
    const isAdmin = assignment.assignmentsUsers.some(
      (user) => user.isAdmin && user.user.id === userId,
    );

    if (!isOwner && !isAdmin) {
      return {
        message: 'Você não tem permissão para alterar esta atividade.',
        success: false,
      };
    }

    const updatedAssignment = (await this.assignmentRepo.update({
      where: {
        id,
      },
      data: {
        icon,
        name,
      },
      include: includedItems,
    })) as IncludedAssignments;

    if (icon && icon !== assignment.icon) {
      this.uploadService.deleteFromDisk(assignment.icon);
    }

    const users = updatedAssignment.assignmentsUsers.map((user) => user.userId);
    await this.sendSubscription(
      {
        assignment: {
          ...updatedAssignment,
          isAdmin: null,
          createdAt: updatedAssignment.createdAt.toISOString(),
        },
        member: null,
        action: 'UPDATE',
      },
      users,
    );

    return updatedAssignment;
  }

  async getAssignments(userId: string, page: number) {
    const assignments = await this.assignmentRepo.getList(userId, page);
    return assignments;
  }

  async getAssignmentUsers(userId: string, assignmentId: string, page: number) {
    const canGetUsers = await this.assignmentUserRepo.findFirst({
      where: {
        assignmentId,
        userId,
      },
    });

    if (!canGetUsers) {
      throw new UnauthorizedException(
        'Você não tem permissão para visualizar os membros desta atividade.',
      );
    }

    const users = await this.assignmentUserRepo.findMany({
      where: {
        assignmentId,
      },
      include: {
        user: {
          select: BASE_USER_SELECTOR,
        },
      },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    });

    return users;
  }

  async getAssignmentById(id: string, userId: string) {
    const assignment = await this.assignmentRepo.findUnique({
      where: {
        id,
        assignmentsUsers: {
          some: {
            userId,
          },
        },
      },
      include: includedItems,
    });

    if (!assignment) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    const user = await this.assignmentUserRepo.findFirst({
      where: {
        assignmentId: id,
        userId,
      },
    });

    return {
      ...assignment,
      isAdmin: user.isAdmin || assignment.ownerId === userId || false,
    };
  }

  async getAssignmentFriends(
    userId: string,
    assignmentId: string,
    page: number,
  ) {
    /* 
      Amigos que podem ser adicionados a atividade
    */
    const userFriends = await this.friendshipService.getAllFriendsAlphabetical(
      userId,
      page,
    );

    const assignmentMembers = await this.assignmentUserRepo.findMany({
      where: {
        assignmentId,
      },
      select: {
        userId: true,
      },
    });

    const assignmentMembersIds = new Set(
      assignmentMembers.map((member) => member.userId),
    );

    const categorizedFriendsWithMembership = userFriends.data.map(
      (category) => ({
        ...category,
        friends: category.friends.map((friend) => ({
          ...friend,
          isMember: assignmentMembersIds.has(friend.id), // Verifica se o amigo já é membro
        })),
      }),
    );

    return {
      ...userFriends,
      count: assignmentMembers.length,
      data: categorizedFriendsWithMembership,
    };
  }

  async searchAssignmentAlphabeticalFriends(
    assignmentId: string,
    userId: string,
    query: string,
    page: number,
  ) {
    const friendsResponse =
      await this.friendshipService.searchFriendsAlphabetically(
        userId,
        page,
        query,
      );

    const assignmentMembers = await this.assignmentUserRepo.findMany({
      where: {
        assignmentId,
      },
      select: {
        userId: true,
      },
    });

    const chatMemberIds = new Set(
      assignmentMembers.map((member) => member.userId),
    );

    const categorizedFriendsWithMembership = friendsResponse.data.map(
      (category) => ({
        ...category,
        friends: category.friends.map((friend) => ({
          ...friend,
          isMember: chatMemberIds.has(friend.id),
        })),
      }),
    );

    return {
      data: categorizedFriendsWithMembership,
      hasNextPage: friendsResponse.hasNextPage,
    };
  }

  async assignments(userId: string) {
    return this.pubSubService.asyncIterator(`assignments:${userId}`);
  }

  async assignmentMember(assignmentId: string, userId: string) {
    const canGetUsers = await this.assignmentUserRepo.findFirst({
      where: {
        assignmentId,
        userId,
      },
    });

    if (!canGetUsers) {
      throw new UnauthorizedException(
        'Você não tem permissão para visualizar os membros desta atividade.',
      );
    }

    return this.pubSubService.asyncIterator(
      `assignments:members:${assignmentId}`,
    );
  }

  async sendMemberSubscription(data: AssignmentUserSub) {
    await this.pubSubService.publish(
      `assignments:members:${data.assignment.id}`,
      {
        assignmentMember: {
          ...data,
        },
      },
    );
  }

  async sendSubscription(data: AssignmentSub, users: string[]) {
    const settedArray = Array.from(new Set(users));
    const onlineStatusPromises = settedArray.map(async (user) => {
      const isUserOnline = await this.usersService.isUserOnline(user);
      return { user: user, isOnline: isUserOnline };
    });

    const onlineUsers = await Promise.all(onlineStatusPromises);

    const sendableUsers = onlineUsers
      .filter((user) => user.isOnline)
      .map((user) => user.user);
    /* 
    1. Ao criar, enviar somente para os usuários foram adicionados.
    2. Ao adicionar, enviar somente ao(s) usuário(s) adicionado(s).
    3. Ao remover, enviar somente ao(s) usuário(s) removido(s).
    4. Ao atualizar, enviar para todos os usuários.
    5. Se o isAdmin: null, manter o estado anterior. Só atualizar caso seja true ou false.
    */

    await Promise.all(
      sendableUsers.map((user) => {
        this.pubSubService.publish(`assignments:${user}`, {
          assignments: {
            ...data,
          },
        });
      }),
    );
  }
}
