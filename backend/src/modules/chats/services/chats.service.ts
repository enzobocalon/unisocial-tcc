import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatRepository } from 'src/shared/database/repositories/chats.repositories';
import { CreateChatDTO } from '../dto/create-chat.dto';
import { FriendshipsService } from '../../friendships/friendships.service';
import { RedisPubSubService } from 'src/shared/redis/pubSub/pubSub.service';
import { UsersService } from 'src/modules/users/users.service';
import { ChatUsersRepository } from 'src/shared/database/repositories/chat-users.repositories';
import { AddUserDTO } from '../dto/add-user.dto';
import { ChatActionRepository } from 'src/shared/database/repositories/chat-actions.repositories';
import { Prisma } from '@prisma/client';
import { Chat } from '../entities/chat.entity';
import { RemoveUserDTO } from '../dto/remove-user.dto';
import { ChatMessageSub } from '../entities/chat-sub.entity';
import { UpdateChatDTO } from '../dto/update-chat.dto';
import { ResponseEntity } from 'src/entities/response.entity';
import { UpdateChatUserDTO } from '../dto/update-user.dto';
import { UploadService } from 'src/modules/upload/upload.service';
import { BASE_USER_SELECTOR, PAGE_SIZE } from 'src/common/constants';
import { UtilsService } from 'src/shared/utils/utils.service';
import { AssignmentRepository } from 'src/shared/database/repositories/assignments/assignments.repositories';
import { AssignmentUserRepository } from 'src/shared/database/repositories/assignments/assignments-users.repositories';

const includedChat = {
  chatUser: {
    select: {
      userId: true,
      isAdmin: true,
      user: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  },
};

type IncludedChat = Prisma.ChatGetPayload<{
  include: typeof includedChat;
}> & {
  isAdmin?: boolean;
  createdAt: string;
  directUserMember: string;
};

const includedChatUser = {
  user: {
    select: BASE_USER_SELECTOR,
  },
  chat: {
    include: {
      chatUser: {
        select: {
          userId: true,
        },
      },
    },
  },
};

type IncludedChatUser = Prisma.ChatUserGetPayload<{
  include: typeof includedChatUser;
}>;

const includedActions = {
  user: {
    select: BASE_USER_SELECTOR,
  },
  actionAuthor: {
    select: BASE_USER_SELECTOR,
  },
};

type IncludedActions = Prisma.ChatActionsGetPayload<{
  include: typeof includedActions;
}>;

const chatIncludedActions = {
  include: {
    user: {
      select: BASE_USER_SELECTOR,
    },
    actionAuthor: {
      select: BASE_USER_SELECTOR,
    },
  },
};

type IncludedChatActions = Prisma.ChatGetPayload<{
  include: {
    chatActions: typeof chatIncludedActions;
  };
}>;

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly friendsService: FriendshipsService,
    private readonly pubSub: RedisPubSubService,
    private readonly usersService: UsersService,
    private readonly chatUsersRepo: ChatUsersRepository,
    private readonly chatActionRepo: ChatActionRepository,
    private readonly uploadService: UploadService,
    private readonly utilsService: UtilsService,
    private readonly assignmentRepo: AssignmentRepository,
    private readonly assignmentUsersRepo: AssignmentUserRepository,
  ) {}

  async create(userId: string, data: CreateChatDTO) {
    const { isDirect, type, users, name, icon } = data;
    if (users && users.length) {
      if (users.length > 49) {
        throw new BadRequestException(
          'Limite de usuários excedidos. Máximo: 50 usuários por grupo',
        );
      }
      const userFriends = await this.friendsService.getUsersFriends(
        userId,
        false,
        false,
      );
      const areFriends = users.every((user) => userFriends.includes(user));
      if (!areFriends) {
        throw new ForbiddenException(
          'Você deve ser amigo do(s) usuário(s) para criar um chat.',
        );
      }
    }

    if (isDirect && !users.length) {
      throw new BadRequestException('Usuários são obrigatórios.');
    }

    if (isDirect) {
      const chatAlreadyExists = (await this.chatUsersRepo.findFirst({
        where: {
          userId,
          chat: {
            isDirect: true,
            chatUser: {
              some: {
                userId: users[0],
              },
            },
          },
        },
        include: includedChatUser,
      })) as IncludedChatUser;
      if (chatAlreadyExists) {
        return chatAlreadyExists.chat;
      }
      const chat = (await this.chatRepo.create({
        data: {
          type: 'PRIVATE',
          isDirect,
          ownerId: userId,
          name: `${userId}<INTERNAL_SERVER_SPLITTER>${users[0]}`,
          chatUser: {
            create: [
              { userId: userId, isAdmin: false }, // não existe admin em direct!
              { userId: users[0], isAdmin: false },
            ],
          },
        },
        include: includedChat,
      })) as IncludedChat;
      chat.name = this.utilsService.chatNameParser(
        chat.name,
        chat.chatUser.map((user) => ({
          name: user.user.name,
          userId: user.userId,
        })),
        userId,
      );
      return chat;
    }

    if (!name) throw new BadRequestException('Nome do chat é obrigatório.');
    users.push(userId);
    const chat = (await this.chatRepo.create({
      data: {
        type,
        isDirect: false,
        ownerId: userId,
        name,
        icon: icon || null,
        chatUser: {
          create: users?.map((currentUser) => ({
            userId: currentUser,
            isAdmin: currentUser === userId,
          })),
        },
        chatActions: {
          create: users?.map((currentUser) => {
            if (currentUser === userId) {
              return {
                action: 'CREATE',
                userId,
                actionAuthorId: currentUser,
              };
            }
            return {
              action: 'ADD',
              userId: currentUser,
              actionAuthorId: userId,
            };
          }),
        },
      },
      include: {
        chatActions: {
          ...chatIncludedActions,
        },
      },
    })) as IncludedChatActions;

    if (users && users.length) {
      const chatAction = chat.chatActions.find((i) => i.action === 'CREATE');

      await this.sendSubscriptionData(users, {
        chat: {
          ...chat,
          createdAt: chat.createdAt.toISOString?.() ?? new Date().toISOString(),
        },
        chatAction: chatAction
          ? {
              ...chatAction,
              createdAt:
                chatAction.createdAt.toISOString?.() ??
                new Date().toISOString(),
            }
          : null,
      });
    }

    return chat;
  }

  // Add methods

  async addUserToChat(userId: string, data: AddUserDTO): Promise<Chat> {
    const { chatId, userToAddId } = data;
    if (!userToAddId) {
      throw new BadRequestException('Usuário a ser adicionado é obrigatório.');
    }
    const isUserAllowedToAdd = await this.chatUsersRepo.findFirst({
      where: {
        OR: [
          {
            chatId,
            userId,
            isAdmin: true,
          },
          {
            chat: {
              ownerId: userId,
              id: chatId,
            },
          },
        ],
      },
    });
    if (!isUserAllowedToAdd) {
      throw new UnauthorizedException(
        'Você não tem permissão para adicionar usuários a este chat.',
      );
    }
    const message = 'adicionou';
    const chat = await this.addUser(
      userToAddId,
      chatId,
      'ADD',
      message,
      userId,
    );
    return {
      ...chat.chat,
      createdAt: new Date().toISOString(),
    };
  }

  async getLinkableChats(assignmentId: string, userId: string, page: number) {
    const assignment = await this.assignmentRepo.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    const user = await this.assignmentUsersRepo.findFirst({
      where: {
        userId,
        assignmentId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Você não faz parte dessa atividade.');
    }

    if (!user.isAdmin || assignment.ownerId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para vincular chats a esta atividade.',
      );
    }

    const chats = await this.chatRepo.findMany({
      where: {
        OR: [
          {
            chatUser: {
              some: {
                userId,
                isAdmin: true,
              },
            },
          },
          {
            ownerId: userId,
          },
        ],
        isDirect: false,
      },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    });

    return chats;
  }

  async joinChat(userId: string, chatId: string): Promise<Chat> {
    const isUserAllowedToJoin = await this.chatRepo.findFirst({
      where: {
        id: chatId,
        type: 'PUBLIC',
      },
    });

    if (!isUserAllowedToJoin) {
      throw new NotFoundException('Chat não encontrado.');
    }
    const chat = await this.addUser(userId, chatId, 'JOIN');
    return {
      ...chat.chat,
      createdAt: new Date(chat.chat.createdAt).toISOString(),
    };
  }

  private async addUser(
    userId: string | string[],
    chatId: string,
    type: 'ADD' | 'JOIN',
    message?: string,
    authorId?: string,
  ) {
    const include = {
      chat: {
        select: {
          isDirect: true,
        },
      },
    };
    type IncludedUserAdd = Prisma.ChatUserGetPayload<{
      include: typeof include;
    }>;
    if (!Array.isArray(userId)) {
      const isUserAlreadyMember = (await this.chatUsersRepo.findFirst({
        where: {
          chatId,
          userId,
        },
        include,
      })) as IncludedUserAdd;

      if (isUserAlreadyMember && isUserAlreadyMember.chat.isDirect) {
        throw new BadRequestException(
          'Tipo de chat inválido para adição de novos usuários',
        );
      }

      if (isUserAlreadyMember) {
        throw new BadRequestException('Usuário já é membro deste chat.');
      }
      const chat = (await this.chatUsersRepo.create({
        data: {
          chatId,
          userId,
          isAdmin: false,
        },
        include: includedChatUser,
      })) as IncludedChatUser;

      const action = (await this.chatActionRepo.create({
        data: {
          action: 'JOIN',
          chatId,
          userId,
          message,
          actionAuthorId: authorId,
        },
        include: includedActions,
      })) as IncludedActions;

      await this.sendSubscriptionData(
        chat.chat.chatUser.map((user) => user.userId),
        {
          chat: {
            ...chat.chat,
            createdAt: new Date(chat.chat.createdAt).toISOString(),
          },
          chatAction: {
            ...action,
            createdAt: new Date(action.createdAt).toISOString(),
          },
        },
      );
      return chat;
    }
    const actions = [];
    for (const id of userId) {
      const isUserAlreadyMember = (await this.chatUsersRepo.findFirst({
        where: {
          chatId,
          userId: id,
        },
        include,
      })) as IncludedUserAdd;

      if (isUserAlreadyMember && isUserAlreadyMember.chat.isDirect) {
        throw new BadRequestException(
          'Tipo de chat inválido para adição de novos usuários',
        );
      }

      if (isUserAlreadyMember) {
        throw new BadRequestException('Usuário já é membro deste chat.');
      }

      await this.chatUsersRepo.create({
        data: {
          chatId,
          userId: id,
          isAdmin: false,
        },
      });

      const action = (await this.chatActionRepo.create({
        data: {
          action: 'ADD',
          chatId,
          userId: id,
          message,
          actionAuthorId: authorId,
        },
        include: includedActions,
      })) as IncludedActions;
      actions.push(action);
    }

    const chat = (await this.chatRepo.findFirst({
      where: {
        id: chatId,
      },
      include: includedChat,
    })) as IncludedChat;

    if (actions.length > 5) {
      message = `${actions[0].actionAuthor.name} adicionou ${
        actions[0].user.name
      }, ${actions[1].user.name} e outros ${actions.length - 2} usuários`;
    } else {
      message = `${actions[0].actionAuthor.name} adicionou ${actions
        .map((i) => i.user.name)
        .join(', ')}`;
    }

    const parsedAction = {
      chat,
      chatAction: {
        actionAuthor: actions[0].actionAuthor,
        createdAt: actions[0].createdAt,
        id: actions[0].id,
        updatedAt: actions[0].updatedAt,
        message,
        action: 'ADD',
        chatId: actions[0].chatId,
      },
    };

    await this.sendSubscriptionData(
      chat.chatUser.map((user) => user.userId),
      parsedAction,
    );
    return parsedAction;
  }

  // Remove methods

  async removeUserFromChat(userId: string, data: RemoveUserDTO) {
    const { chatId, userToRemoveId } = data;
    if (!userToRemoveId) {
      throw new BadRequestException('Usuário a ser removido é obrigatório.');
    }

    const isUserAllowedToRemove = await this.chatUsersRepo.findFirst({
      where: {
        OR: [
          {
            chatId,
            userId,
            isAdmin: true,
          },
          {
            chat: {
              ownerId: userId,
              id: chatId,
            },
          },
        ],
      },
    });

    if (!isUserAllowedToRemove) {
      throw new UnauthorizedException(
        'Você não tem permissão para remover usuários deste chat.',
      );
    }

    const chat = await this.removeUser(
      userToRemoveId,
      chatId,
      'removeu',
      'REMOVE',
      userId,
    );
    return chat.chat;
  }

  async leaveChat(userId: string, data: RemoveUserDTO) {
    const { chatId } = data;
    const chat = await this.removeUser(userId, chatId, undefined, 'LEAVE');
    return chat.chat;
  }

  private async removeUser(
    userId: string,
    chatId: string,
    message?: string,
    type?: 'REMOVE' | 'LEAVE',
    authorId?: string,
  ) {
    const isUserOwner = await this.chatUsersRepo.findFirst({
      where: {
        chatId,
        userId,
        chat: {
          ownerId: userId,
        },
      },
    });

    const chatInfo = (await this.chatRepo.findFirst({
      where: {
        id: chatId,
      },
      include: {
        chatUser: true,
      },
    })) as ChatWithUsers;

    if (isUserOwner) {
      if (isUserOwner.userId === authorId) {
        const isLastUser =
          chatInfo.chatUser.length === 1 &&
          chatInfo.chatUser[0].userId === userId;
        const isGroup = !chatInfo.isDirect;

        // Se for o último usuário e for um grupo, apagar o grupo
        if (isLastUser && isGroup) {
          await this.chatRepo.delete({
            where: {
              id: chatId,
            },
          });

          return {
            chat: {
              ...chatInfo,
              chatUser: [],
              createdAt: new Date(chatInfo.createdAt).toISOString(),
            },
            isAdmin: false,
          };
        }
        throw new ForbiddenException(
          'Você não pode sair de um chat que criou. Para isso, passe a liderança a outro usuário.',
        );
      }
      if (isUserOwner.userId === userId) {
        throw new BadRequestException('Você não pode remover o dono do grupo.');
      }
    }

    const chatUserId = await this.chatUsersRepo.findFirst({
      where: {
        chatId,
        userId,
      },
    });
    if (!chatUserId) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    type ChatWithUsers = Prisma.ChatGetPayload<{
      include: { chatUser: true };
    }>;

    // Caso contrário, continuar com o comportamento normal
    const chat = (await this.chatUsersRepo.delete({
      where: {
        id: chatUserId.id,
        chatId,
        userId,
      },
      include: includedChatUser,
    })) as IncludedChatUser;

    const isChatAdmin = await this.chatUsersRepo.findFirst({
      where: {
        chatId,
        userId: authorId,
      },
    });

    chat.isAdmin = isChatAdmin?.isAdmin || false;

    const action = (await this.chatActionRepo.create({
      data: {
        action: type,
        chatId,
        userId,
        message,
        actionAuthorId: authorId,
      },
      include: includedActions,
    })) as IncludedActions;

    await this.sendSubscriptionData(
      [...chat.chat.chatUser.map((user) => user.userId), chatUserId.userId],
      {
        chat: {
          ...chat.chat,
          createdAt: new Date(chat.chat.createdAt).toISOString(),
        },
        chatAction: {
          ...action,
          createdAt: new Date(action.createdAt).toISOString(),
        },
      },
    );
    return chat;
  }

  async transferOwnership(
    currentOwnerId: string,
    userId: string,
    chatId: string,
  ) {
    const isOwner = await this.chatRepo.findFirst({
      where: {
        ownerId: currentOwnerId,
        id: chatId,
      },
    });

    if (!isOwner) {
      throw new NotFoundException('Chat não encontrado.');
    }

    const user = await this.chatUsersRepo.findFirst({
      where: {
        chatId,
        userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const chat = {
      ...((await this.chatRepo.update({
        data: {
          ownerId: userId,
        },
        where: {
          id: chatId,
        },
        include: includedChat,
      })) as IncludedChat),
      isAdmin: true,
    };
    await this.chatUsersRepo.update({
      data: {
        isAdmin: true,
      },
      where: {
        id: user.id,
        chatId,
        userId,
      },
    });

    const action = (await this.chatActionRepo.create({
      data: {
        action: 'CHAT_UPDATE',
        chatId,
        userId: currentOwnerId,
        actionAuthorId: currentOwnerId,
      },
      include: includedActions,
    })) as IncludedActions;
    await this.sendSubscriptionData(
      chat.chatUser.map((user) => user.userId),
      {
        chat,
        chatAction: {
          ...action,
          createdAt: new Date(action.createdAt).toISOString(),
        },
      },
    );

    return chat;
  }

  // Query methods

  async getChatMembers(userId: string, chatId: string, page: number) {
    const isUserAllowedToGetMembers = await this.chatUsersRepo.findFirst({
      where: {
        chatId,
        userId,
      },
    });

    if (!isUserAllowedToGetMembers) {
      throw new ForbiddenException(
        'Você não tem permissão para ver os membros deste chat.',
      );
    }

    const chat = await this.chatRepo.findFirst({
      where: {
        id: chatId,
      },
    });

    if (chat.isDirect) {
      throw new BadRequestException(
        'Chat direto não possui membros. Apenas os usuários que estão na conversa.',
      );
    }

    const members = await this.chatUsersRepo.findMany({
      where: {
        chatId,
      },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
      include: includedChatUser,
    });

    return members;
  }

  async getChatById(userId: string, chatId: string) {
    const chat = (await this.chatRepo.findFirst({
      where: {
        id: chatId,
        AND: [
          {
            chatUser: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: includedChat,
    })) as IncludedChat;

    if (!chat) {
      throw new NotFoundException('Chat não encontrado.');
    }

    if (chat.isDirect) {
      const [id1, id2] = chat.name.split('<INTERNAL_SERVER_SPLITTER>');
      chat.directUserMember = userId === id1 ? id2 : id1;
      chat.name = this.utilsService.chatNameParser(
        chat.name,
        chat.chatUser.map((user) => ({
          name: user.user.name,
          userId: user.userId,
        })),
        userId,
      );
      chat.icon = this.utilsService.getDirectImage(
        chat.chatUser.map((c) => ({
          userId: c.userId,
          avatar: c.user.avatar,
        })),
        userId,
      );
    } else {
      const isAdminOrOwner =
        chat.ownerId === userId
          ? true
          : chat.chatUser.some(
              (user) => user.userId === userId && user.isAdmin,
            );
      chat.isAdmin = isAdminOrOwner;
      chat.directUserMember = null;
    }
    return chat;
  }

  async getChatByUserMember(id: string, userId: string) {
    const chat = (await this.chatRepo.findFirst({
      where: {
        isDirect: true,
        chatUser: {
          every: {
            userId: { in: [id, userId] },
          },
          some: {
            userId: { in: [id, userId] },
          },
        },
      },
      include: includedChat,
    })) as IncludedChat;

    if (!chat) {
      throw new NotFoundException('Chat não encontrado.');
    }

    chat.name = this.utilsService.chatNameParser(
      chat.name,
      chat.chatUser.map((user) => ({
        name: user.user.name,
        userId: user.userId,
      })),
      userId,
    );
    return chat;
  }

  async getChatFriends(userId: string, chatId: string, page: number) {
    try {
      const userFriends = await this.friendsService.getAllFriendsAlphabetical(
        userId,
        page,
      );
      const chatMembers = await this.chatUsersRepo.findMany({
        where: {
          chatId,
        },
        select: {
          userId: true,
        },
      });

      const chatMemberIds = new Set(chatMembers.map((member) => member.userId));

      // Adiciona a verificação de associação ao chat
      const categorizedFriendsWithMembership = userFriends.data.map(
        (category) => ({
          ...category,
          friends: category.friends.map((friend) => ({
            ...friend,
            isMember: chatMemberIds.has(friend.id), // Verifica se o amigo já é membro
          })),
        }),
      );

      return {
        ...userFriends,
        count: chatMembers.length,
        data: categorizedFriendsWithMembership,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao obter amigos para o chat');
    }
  }

  async searchChatFriends(
    userId: string,
    chatId: string,
    page: number,
    query: string,
  ) {
    try {
      const friendsResponse =
        await this.friendsService.searchFriendsAlphabetically(
          userId,
          page,
          query,
        );

      const chatMembers = await this.chatUsersRepo.findMany({
        where: {
          chatId,
        },
        select: {
          userId: true,
        },
      });

      const chatMemberIds = new Set(chatMembers.map((member) => member.userId));

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
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar amigos no chat');
    }
  }

  async getAllChats(userId: string, page: number) {
    const chats = await this.chatRepo.getChatsByUser(userId, page);
    for (const chat of chats) {
      if (!chat.chat.isDirect) {
        continue;
      }
      const [name, id] = chat.chat.name.split('<INTERNAL_SERVER_SPLITTER>');
      chat.chat.name = name;
      const isOnline = await this.usersService.isUserOnline(id);
      chat.chat.isOnline = isOnline;
    }
    return chats;
  }

  // Settings
  async updateChatSettings(userId: string, data: UpdateChatDTO) {
    const { chatId, name, type, icon } = data;
    if (!chatId) {
      throw new BadRequestException('Chat inválido.');
    }

    const isUserAllowedToUpdate = await this.chatUsersRepo.findFirst({
      where: {
        OR: [
          {
            chatId,
            userId,
            isAdmin: true,
          },
          {
            chat: {
              ownerId: userId,
              id: chatId,
            },
          },
        ],
      },
    });

    if (!isUserAllowedToUpdate) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este chat.',
      );
    }

    const originalChat = await this.chatRepo.findFirst({
      where: {
        id: chatId,
      },
    });
    if (originalChat.icon && !icon) {
      await this.uploadService.deleteFromDisk(originalChat.icon);
    }

    const chat = (await this.chatRepo.update({
      data: {
        name,
        type,
        icon: icon || null,
      },
      where: {
        id: chatId,
      },
      include: includedChat,
    })) as IncludedChat;

    if (originalChat.icon && icon && originalChat.icon != icon) {
      await this.uploadService.deleteFromDisk(originalChat.icon);
    }

    const isAdminOrOwner =
      chat.ownerId === userId
        ? true
        : chat.chatUser.some((user) => user.userId === userId && user.isAdmin);
    chat.isAdmin = isAdminOrOwner;

    const action = (await this.chatActionRepo.create({
      data: {
        action: 'CHAT_UPDATE',
        chatId,
        userId,
        actionAuthorId: userId,
      },
      include: includedActions,
    })) as IncludedActions;

    await this.sendSubscriptionData(
      chat.chatUser.map((user) => user.userId),
      {
        chat,
        chatAction: {
          ...action,
          createdAt: new Date(action.createdAt).toISOString(),
        },
      },
    );

    return chat;
  }

  async linkChatToAssignment(
    chatId: string,
    assignmentId: string,
    userId: string,
  ) {
    const [chat, assignment, chatMember, assignmentMember]: [
      any | null, // temp
      Prisma.AssignmentsGetPayload<unknown> | null,
      Prisma.ChatUserGetPayload<unknown> | null,
      Prisma.AssignmentsUsersGetPayload<unknown> | null,
    ] = await Promise.all([
      this.chatRepo.findFirst({
        where: {
          id: chatId,
        },
        include: includedChat,
      }),
      this.assignmentRepo.findUnique({
        where: {
          id: assignmentId,
        },
      }),
      this.chatUsersRepo.findFirst({
        where: {
          userId,
        },
      }),
      this.assignmentUsersRepo.findFirst({
        where: {
          userId,
        },
      }),
    ]);

    if (!chat || !chatMember) {
      throw new NotFoundException('Chat não encontrado');
    }

    if (!assignment || !assignmentMember) {
      throw new NotFoundException('Atividade não encontrada');
    }

    const hasChatPermission = chat.ownerId === userId || chatMember.isAdmin;
    const hasAssignmentPermission =
      assignment.ownerId === userId || assignmentMember.isAdmin;

    if (!hasAssignmentPermission || !hasChatPermission) {
      throw new ForbiddenException(
        'Você não tem permissão para vincular esse chat. Deve possuir administrador em ambos.',
      );
    }

    await this.assignmentRepo.update({
      where: {
        id: assignmentId,
      },
      data: {
        chatId,
      },
    });

    const action = (await this.chatActionRepo.create({
      data: {
        actionAuthorId: userId,
        action: 'ASSIGNMENT_LINK',
        chatId,
        userId,
      },
      include: includedActions,
    })) as IncludedActions;

    await this.sendSubscriptionData(
      chat.chatUser.map((user) => user.userId),
      {
        chat,
        chatAction: {
          ...action,
          createdAt: new Date(action.createdAt).toISOString(),
        },
      },
    );

    return {
      message: 'Chat vinculado com sucesso.',
      success: true,
    };
  }

  async unlinkChatAndAssignment(
    chatId: string,
    assignmentId: string,
    userId: string,
  ) {
    const [chat, assignment, chatMember, assignmentMember]: [
      any | null, // temp
      Prisma.AssignmentsGetPayload<unknown> | null,
      Prisma.ChatUserGetPayload<unknown> | null,
      Prisma.AssignmentsUsersGetPayload<unknown> | null,
    ] = await Promise.all([
      this.chatRepo.findFirst({
        where: {
          id: chatId,
        },
        include: includedChat,
      }),
      this.assignmentRepo.findUnique({
        where: {
          id: assignmentId,
        },
      }),
      this.chatUsersRepo.findFirst({
        where: {
          userId,
        },
      }),
      this.assignmentUsersRepo.findFirst({
        where: {
          userId,
        },
      }),
    ]);

    if (!chat || !chatMember) {
      throw new NotFoundException('Chat não encontrado');
    }

    if (!assignment || !assignmentMember) {
      throw new NotFoundException('Atividade não encontrada');
    }

    const hasChatPermission = chat.ownerId === userId || chatMember.isAdmin;
    const hasAssignmentPermission =
      assignment.ownerId === userId || assignmentMember.isAdmin;

    if (!hasAssignmentPermission || !hasChatPermission) {
      throw new ForbiddenException(
        'Você não tem permissão para desvincular esse chat. Deve possuir administrador em ambos.',
      );
    }

    await this.assignmentRepo.update({
      where: {
        id: assignmentId,
      },
      data: {
        chatId: null,
      },
    });

    const action = (await this.chatActionRepo.create({
      data: {
        actionAuthorId: userId,
        action: 'ASSIGNMENT_UNLINK',
        chatId,
        userId,
      },
      include: includedActions,
    })) as IncludedActions;

    await this.sendSubscriptionData(
      chat.chatUser.map((user) => user.userId),
      {
        chat,
        chatAction: {
          ...action,
          createdAt: new Date(action.createdAt).toISOString(),
        },
      },
    );

    return {
      message: 'Chat desvinculado com sucesso.',
      success: true,
    };
  }

  async changeUserRole(
    userId: string,
    data: UpdateChatUserDTO,
  ): Promise<ResponseEntity> {
    const { chatId, isAdmin, userToUpdateId } = data;
    const isUserAllowedToUpdate = await this.chatUsersRepo.findFirst({
      where: {
        chat: {
          ownerId: userId,
          id: chatId,
        },
      },
    });

    if (!isUserAllowedToUpdate) {
      throw new ForbiddenException(
        'Você não tem permissão para dar cargos neste chat.',
      );
    }

    const chatUser = (await this.chatUsersRepo.findFirst({
      where: {
        chatId,
        userId: userToUpdateId,
      },
      include: includedChatUser,
    })) as IncludedChatUser;

    if (!chatUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (chatUser.isAdmin === isAdmin) {
      throw new BadRequestException('Usuário já tem este papel.');
    }

    const updatedUser = await this.chatUsersRepo.update({
      data: {
        isAdmin,
      },
      where: {
        id: chatUser.id,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const action = (await this.chatActionRepo.create({
      data: {
        action: 'USER_ROLE_UPDATE',
        chatId,
        userId: userToUpdateId,
        actionAuthorId: userId,
      },
      include: includedActions,
    })) as IncludedActions;

    const chat = (await this.chatRepo.findFirst({
      where: {
        id: chatId,
      },
      include: includedChat,
    })) as IncludedChat;

    await this.sendSubscriptionData(
      chatUser.chat.chatUser.map((user) => user.userId),
      {
        chat,
        chatAction: {
          ...action,
          user: {
            ...chatUser.user,
            isAdmin,
          },
          createdAt: new Date(action.createdAt).toISOString(),
        },
      },
    );
    return { message: 'Cargo atualizado com sucesso.', success: true };
  }

  async getChatActions(userId: string, chatId: string, page: number) {
    const isUserAllowedToGetActions = await this.chatUsersRepo.findFirst({
      where: {
        chatId,
        userId,
        isAdmin: true,
      },
    });

    if (!isUserAllowedToGetActions) {
      throw new ForbiddenException(
        'Você não tem permissão para ver as ações deste chat.',
      );
    }

    const actions = (await this.chatActionRepo.findMany({
      where: {
        chatId,
      },
      include: includedActions,
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    })) as IncludedActions[];

    return actions;
  }

  private async sendSubscriptionData(
    chatUser: string[],
    dataToSend: ChatMessageSub,
  ) {
    const settedArray = Array.from(new Set(chatUser));
    const onlineStatusPromises = settedArray.map(async (user) => {
      const isUserOnline = await this.usersService.isUserOnline(user);
      return { user: user, isOnline: isUserOnline };
    });

    const onlineUsers = await Promise.all(onlineStatusPromises);


    const userPublishPromises = onlineUsers
      .filter((user) => user.isOnline)
      .map((user) =>
        this.pubSub.publish(`chat:${user.user}`, {
          chats: {
            chat: dataToSend.chat,
            chatAction: dataToSend.chatAction,
          },
        }),
      );

    const chatPublishPromise = this.pubSub.publish(
      `chat:${dataToSend.chat.id}`,
      {
        activeChat: {
          chat: {
            ...dataToSend.chat,
            createdAt:
              typeof dataToSend.chat.createdAt === 'string'
                ? dataToSend.chat.createdAt
                : new Date(dataToSend.chat.createdAt).toISOString(),
          },
          chatAction: {
            ...dataToSend.chatAction,
            createdAt:
              typeof dataToSend.chatAction.createdAt === 'string'
                ? dataToSend.chatAction.createdAt
                : new Date(dataToSend.chatAction.createdAt).toISOString(),
          },
        },
      },
    );

     ✅ Aguarda todas as promises juntas (spread do array)
    await Promise.all([...userPublishPromises, chatPublishPromise]);
  }

  async chat(userId: string) {
    return this.pubSub.asyncIterator(`chat:${userId}`);
  }

  async activeChat(chatId: string, userId: string) {
    const canAccess = await this.chatUsersRepo.findFirst({
      where: {
        chatId,
        userId,
      },
    });
    if (!canAccess) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este chat.',
      );
    }
    return this.pubSub.asyncIterator(`chat:${chatId}`);
  }
}
