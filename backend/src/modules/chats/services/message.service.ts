import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  MessageRepository,
  RawContentData,
} from 'src/shared/database/repositories/messages.repositories';
import { CreateMessageDTO } from '../dto/create-message.dto';
import { ChatsService } from './chats.service';
import { ChatUsersRepository } from 'src/shared/database/repositories/chat-users.repositories';
import { RedisPubSubService } from 'src/shared/redis/pubSub/pubSub.service';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/modules/users/users.service';
import { UploadService } from 'src/modules/upload/upload.service';
import { MessageStatusRepository } from 'src/shared/database/repositories/message-status.repositories';
import { BASE_USER_SELECTOR, PAGE_SIZE } from 'src/common/constants';
import { ChatActionRepository } from 'src/shared/database/repositories/chat-actions.repositories';
import { ChatContent } from '../entities/content.entity';
import { ResponseEntity } from 'src/entities/response.entity';
import { UtilsService } from 'src/shared/utils/utils.service';

const includedItems = {
  user: {
    select: BASE_USER_SELECTOR,
  },
  chat: {
    select: {
      id: true,
      icon: true,
      isDirect: true,
      type: true,
      name: true,
      createdAt: true,
      chatUser: {
        select: {
          userId: true,
          user: {
            select: {
              avatar: true,
              name: true,
            },
          },
        },
      },
    },
  },
  media: {
    select: {
      id: true,
      url: true,
    },
  },
  messageStatus: {
    select: {
      userId: true,
      messageId: true,
      status: true,
      user: {
        select: BASE_USER_SELECTOR,
      },
    },
  },
};

type MessageInclude = Prisma.MessageGetPayload<{
  include: typeof includedItems;
}>;

const partialIncludedItem = {
  user: {
    select: BASE_USER_SELECTOR,
  },
  chat: {
    select: {
      id: true,
      isDirect: true,
      createdAt: true,
      type: true,
      icon: true,
      name: true,
      chatUser: {
        select: {
          userId: true,
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  },
  media: {
    select: {
      id: true,
      url: true,
    },
  },
  messageStatus: {
    select: {
      status: true,
    },
  },
};

type PartialMessageInclude = Prisma.MessageGetPayload<{
  include: typeof includedItems;
}> & {
  status?: boolean;
};

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly messageStatusRepo: MessageStatusRepository,
    private readonly chatService: ChatsService,
    private readonly pubSub: RedisPubSubService,
    private readonly chatUsersRepo: ChatUsersRepository,
    private readonly chatActionRepo: ChatActionRepository,
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
    private readonly utilsService: UtilsService,
  ) {}
  async sendMessage(userId: string, data: CreateMessageDTO) {
    const { content, chatId, medias } = data;
    if (!content && !medias) {
      throw new BadRequestException(
        'Você deve enviar um conteúdo ou uma mídia.',
      );
    }
    const isMember = await this.chatUsersRepo.findFirst({
      where: {
        chatId,
        userId,
      },
    });
    if (!isMember) {
      throw new ForbiddenException('Você não é membro deste chat.');
    }

    const chatUsers = await this.chatUsersRepo.findMany({
      where: {
        chatId,
      },
    });
    const createdMessage = (await this.messageRepo.create({
      data: {
        chatId,
        content,
        userId,
        media: {
          create: medias?.map((media) => ({
            url: media,
            userId,
          })),
        },
        hasMedia: medias ? true : false,
        messageStatus: {
          create: chatUsers.map((chatUser) => ({
            userId: chatUser.userId,
            status: chatUser.userId === userId ? 'READ' : 'UNREAD',
          })),
        },
      },
      include: partialIncludedItem,
    })) as PartialMessageInclude;

    const message = {
      ...createdMessage,
      status: createdMessage.userId === userId ? false : null,
      chat: {
        ...createdMessage.chat,
      },
    };
    message.createdAt = new Date(
      message.createdAt,
    ).toISOString() as unknown as Date;

    await this.sendSubscriptionData(message);

    return message;
  }

  async deleteMessage(userId: string, messageId: string, chatId: string) {
    const message = (await this.messageRepo.findUnique({
      where: {
        id: messageId,
      },
      include: includedItems,
    })) as MessageInclude;

    if (message.userId !== userId) {
      const isUserAdminOrChatOwner = await this.chatUsersRepo.findFirst({
        where: {
          OR: [
            {
              chatId,
              chat: {
                ownerId: userId,
                message: {
                  some: {
                    id: messageId,
                  },
                },
              },
            },
            {
              userId,
              chatId,
              isAdmin: true,
            },
          ],
        },
      });

      if (!isUserAdminOrChatOwner) {
        throw new ForbiddenException('Você não pode deletar esta mensagem.');
      }
    }

    for (const media of message.media) {
      await this.uploadService.deleteFile(media.id, message.userId);
    }

    await this.messageRepo.delete({
      where: {
        id: messageId,
      },
    });

    await this.sendSubscriptionData(message, true);

    return {
      success: true,
      message: 'Mensagem deletada com sucesso.',
    };
  }

  async updateChatMessagesStatus(
    userId: string,
    chatId: string,
  ): Promise<ResponseEntity> {
    const isUserMember = await this.chatUsersRepo.findFirst({
      where: { chatId, userId },
    });

    if (!isUserMember) {
      throw new ForbiddenException('Você não é membro deste chat.');
    }

    const messages = (await this.messageRepo.findMany({
      where: {
        chatId,
        NOT: [
          {
            userId,
          },
        ],
        messageStatus: { some: { status: 'UNREAD' } },
      },
      include: includedItems,
    })) as MessageInclude[];

    const messageIdsToUpdate = messages.map((message) => message.id);

    await this.messageStatusRepo.updateMany({
      where: {
        message: { id: { in: messageIdsToUpdate }, chatId },
        userId,
        status: 'UNREAD',
      },
      data: { status: 'READ' },
    });

    return {
      success: true,
      message: 'Mensagens marcadas como lidas com sucesso.',
    };
  }

  async getChatContent(userId: string, chatId: string, page: number) {
    const isUserMember = await this.chatUsersRepo.findFirst({
      where: {
        chatId,
        userId,
      },
    });

    if (!isUserMember) {
      throw new ForbiddenException('Você não é membro deste chat.');
    }

    const messages = (
      (await this.messageRepo.findMany({
        where: {
          chatId,
        },
        include: partialIncludedItem,
        orderBy: {
          createdAt: 'desc',
        },
        take: PAGE_SIZE,
        skip: page * PAGE_SIZE,
      })) as PartialMessageInclude[]
    ).map((message) => ({
      ...message,
      createdAt: new Date(message.createdAt).toISOString(),
      status:
        message.userId === userId
          ? message.messageStatus.every((item) => item.status === 'READ')
          : null,
    }));

    return messages;
  }

  private mergeActions(data: ChatContent[]): ChatContent[] {
    const result: ChatContent[] = [];
    let currentGroup: ChatContent | null = null;
    let groupedUsers: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const content = data[i];

      if (
        content.system &&
        content.action &&
        ['ADD', 'REMOVE'].includes(content.action.action)
      ) {
        const actionType = content.action.action;

        //Verifica se a ação é do mesmo tipo (ADD/REMOVE) e se estão dentro de 1 minuto
        if (
          currentGroup &&
          currentGroup.action?.action === actionType &&
          new Date(content.createdAt).getTime() -
            new Date(currentGroup.createdAt).getTime() <=
            60000
        ) {
          groupedUsers.push(content.action.user.name);
        } else {
          //Caso não esteja, finaliza o grupo
          if (currentGroup) {
            currentGroup.action!.message = this.formatGroupedMessage(
              currentGroup.action.action,
              groupedUsers,
              currentGroup.author.name,
            );
            result.push(currentGroup);
          }
          //Inicia um novo grupo (caso seja a primeira ação do tipo e/ou grupo vazio)
          currentGroup = { ...content };
          groupedUsers = [content.action.user.name]; //Começa com o primeiro usuário
        }
      } else {
        //Caso não seja do tipo ADD/REMOVE, finaliza o grupo atual (caso exista)
        if (currentGroup) {
          currentGroup.action.message = this.formatGroupedMessage(
            currentGroup.action.action,
            groupedUsers,
            currentGroup.author.name,
          );
          result.push(currentGroup); //adiciona o grupo ao resultado
          currentGroup = null; //Reinicia o grupo para que não seja considerado na próxima iteração
        }
        result.push(content); //adiciona as ações que não são do tipo ADD/REMOVE diretamente
      }
    }

    //Adiciona o último grupo, se houver
    if (currentGroup) {
      currentGroup.action!.message = this.formatGroupedMessage(
        currentGroup.action.action,
        groupedUsers,
        currentGroup.author.name,
      );
      result.push(currentGroup);
    }
    return result;
  }

  private formatGroupedMessage(
    action: string,
    users: string[],
    author: string,
  ): string {
    const maxUsersToShow = 3; //Limite de nomes visíveis
    const totalUsers = users.length;
    if (totalUsers > maxUsersToShow) {
      const displayedUsers = users.slice(0, maxUsersToShow);
      const remainingCount = totalUsers - maxUsersToShow;
      return `${
        action === 'ADD' ? 'adicionou' : 'removeu'
      } ${displayedUsers.join(', ')} e outros ${remainingCount} usuários`;
    }

    return `${author} ${
      action === 'ADD' ? 'adicionou' : 'removeu'
    } ${users.join(', ')}`;
  }

  private parseContent(data: RawContentData): ChatContent {
    const response = {
      id: data.id,
      system: data.system,
      createdAt: data.created_at,

      message: !data.system
        ? {
            content: data.message_content,
            hasMedia: data.media_urls ? true : false,
            media: {
              urls: data.media_urls ?? null,
            },
          }
        : null,
      author: {
        id: data.action_author_id ? data.action_author_id : data.user_id,
        name: data.action_author_name
          ? data.action_author_name
          : data.user_name,
        avatar: data.action_author_avatar
          ? data.action_author_avatar
          : data.user_avatar,
        username: data.action_author_username
          ? data.action_author_username
          : data.user_username,
      },
      action: data.system
        ? {
            action: data.action,
            user: {
              id: data.user_id,
              name: data.user_name,
              avatar: data.user_avatar,
              username: data.user_username,
            },
            author: {
              id: data.action_author_id,
              name: data.action_author_name,
              avatar: data.action_author_avatar,
              username: data.action_author_username,
            },
            message: null,
          }
        : null,
    };
    return response;
  }

  private async sendSubscriptionData(
    message: PartialMessageInclude,
    isDelete = false,
  ) {
    const parsedDate = new Date(message.createdAt).toISOString();

    const chatsUsers = message.chat.chatUser.map((chatUser) => chatUser.userId);
    const onlineChatUsersPromises = chatsUsers.map((chatUser) =>
      this.usersService.isUserOnline(chatUser),
    );
    const onlineStatusResults = await Promise.all(onlineChatUsersPromises);
    const onlineChatUsers = chatsUsers.filter(
      (userId, index) => onlineStatusResults[index],
    );

    const userPublishPromises = onlineChatUsers.map((userId) => {
      const toBeSentMessage = { ...message };

      if (toBeSentMessage.chat.isDirect) {
        const updatedChat = {
          ...toBeSentMessage.chat,
          name: this.utilsService.chatNameParser(
            toBeSentMessage.chat.name,
            toBeSentMessage.chat.chatUser.map((c) => ({
              userId: c.userId,
              name: c.user.name,
            })),
            userId,
          ),
          icon: this.utilsService.getDirectImage(
            toBeSentMessage.chat.chatUser.map((c) => ({
              userId: c.userId,
              avatar: c.user.avatar,
            })),
            userId,
          ),
        };
        toBeSentMessage.chat = updatedChat;
      }

      return this.pubSub.publish(`chat:${userId}`, {
        chats: {
          chat: toBeSentMessage.chat,
          message: {
            ...toBeSentMessage,
            createdAt: parsedDate,
            deletedAt: isDelete ? new Date().toISOString() : null,
          },
        },
      });
    });

    const chatPublishPromise = this.pubSub.publish(`chat:${message.chat.id}`, {
      activeChat: {
        chat: message.chat,
        message: {
          ...message,
          createdAt: parsedDate,
          deletedAt: isDelete ? new Date().toISOString() : null,
        },
      },
    });

    await Promise.all([...userPublishPromises, chatPublishPromise]);
  }

  async message(messageId: string, userId: string) {
    const canAccess = await this.messageRepo.findUnique({
      where: {
        id: messageId,
        userId,
      },
    });

    if (!canAccess) {
      throw new UnauthorizedException('Você não tem permissão para acessar.');
    }
    return this.pubSub.asyncIterator(`message:${messageId}`);
  }

  async messageStatus(userId: string) {
    return this.pubSub.asyncIterator(`chat:messageUpdate:${userId}`);
  }
}
