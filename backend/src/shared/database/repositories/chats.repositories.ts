import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { ChatMessageSub } from 'src/modules/chats/entities/chat-sub.entity';
import { ChatActionEntity } from 'src/modules/chats/entities/chat-action.entity';
import { ChatType } from 'src/modules/chats/entities/chat.entity';
import { BASE_USER_SELECTOR, PAGE_SIZE } from 'src/common/constants';

interface RawData {
  id: string;
  name: string;
  owner_id: string;
  type: ChatType;
  icon: string;
  is_direct: boolean;
  created_at: Date;
  updated_at: string;
  message_id: string | null;
  message_user_id: string | null;
  message_chat_id: string | null;
  message_content: string | null;
  message_has_media: boolean | null;
  message_created_at: string | null;
  action_id: string;
  action_chat_id: string;
  action_action: ChatActionEntity['action'];
  action_user_id: string;
  action_message: string | null;
  action_created_at: Date;
  action_author_id: string;
  action_author_name: string;
  action_author_username: string;
  action_author_avatar: string | null;
  message_user_name: string | null;
  message_user_username: string | null;
  message_user_avatar: string | null;
  action_user_name: string;
  action_user_username: string;
  action_user_avatar: string | null;
  unread_message_count: string | null;
  directUserMember: string | null;
}

@Injectable()
export class ChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ChatCreateArgs) {
    return this.prismaService.chat.create(createDto);
  }

  findMany(findManyDto: Prisma.ChatFindManyArgs) {
    return this.prismaService.chat.findMany(findManyDto);
  }

  findUnique(findUniqueDto: Prisma.ChatFindUniqueArgs) {
    return this.prismaService.chat.findUnique(findUniqueDto);
  }

  findFirst(findFirstDto: Prisma.ChatFindFirstArgs) {
    return this.prismaService.chat.findFirst(findFirstDto);
  }

  update(updateDto: Prisma.ChatUpdateArgs) {
    return this.prismaService.chat.update(updateDto);
  }

  delete(deleteDto: Prisma.ChatDeleteArgs) {
    return this.prismaService.chat.delete(deleteDto);
  }

  async getChatsByUser(userId: string, page: number) {
    const chats: RawData[] = await this.prismaService.$queryRaw`
      SELECT 
          c.*, 
          m.id as message_id,
          m.user_id as message_user_id,
          m.chat_id as message_chat_id,
          m.content as message_content,
          m.has_media as message_has_media,
          m.created_at as message_created_at,
          ca.id as action_id,
          ca.chat_id as action_chat_id,
          ca.action as action_action,
          ca.user_id as action_user_id,
          ca.message as action_message,
          ca.created_at as action_created_at,
          action_author.id AS action_author_id,
          action_author.name AS action_author_name,
          action_author.username AS action_author_username,
          action_author.avatar AS action_author_avatar,
          u.id AS message_user_id,
          u.name AS message_user_name,
          u.username AS message_user_username,
          u.avatar AS message_user_avatar,
          action_user.id AS action_user_id,
          action_user.name AS action_user_name,
          action_user.username AS action_user_username,
          action_user.avatar AS action_user_avatar,
          COALESCE(unread_messages.unread_count, 0) AS unread_message_count
      FROM 
          chats c
      LEFT JOIN (
          SELECT 
              m.*, 
              ROW_NUMBER() OVER (PARTITION BY m.chat_id ORDER BY m.created_at DESC) as seqnum
          FROM 
              messages m
      ) m ON c.id = m.chat_id AND m.seqnum = 1
      LEFT JOIN (
          SELECT 
              ca.*, 
              ROW_NUMBER() OVER (PARTITION BY ca.chat_id ORDER BY ca.created_at DESC) as seqnum2
          FROM 
              chat_actions ca
      ) ca ON c.id = ca.chat_id AND ca.seqnum2 = 1
      LEFT JOIN 
          users AS action_author ON action_author.id = ca.action_author_id
      LEFT JOIN 
          users AS u ON u.id = m.user_id
      LEFT JOIN 
          users AS action_user ON action_user.id = ca.user_id
      LEFT JOIN LATERAL (
          SELECT 
              m.chat_id,
              COUNT(ms.message_id) AS unread_count
          FROM 
              messages m
          LEFT JOIN 
              message_status ms ON m.id = ms.message_id AND ms.status = 'UNREAD' AND ms.user_id = ${userId}
          WHERE 
              m.chat_id = c.id
          GROUP BY 
              m.chat_id
      ) AS unread_messages ON TRUE
      WHERE 
          EXISTS (
              SELECT 
                  1
              FROM 
                  chat_users cu
              WHERE 
                  cu.chat_id = c.id
              AND 
                  cu.user_id = ${userId}
          )
      ORDER BY 
        GREATEST(COALESCE(m.created_at, '1970-01-01'), COALESCE(ca.created_at, '1970-01-01')) DESC

      LIMIT ${PAGE_SIZE} OFFSET ${page * PAGE_SIZE};
    `;

    const parsedData: ChatMessageSub[] = [];
    for (const chat of chats) {
      if (!chat.message_id && !chat.action_id) {
        continue; // Ignora chats sem mensagens e sem ações
      }

      const status = chat.message_id
        ? await this.prismaService.messageStatus.findMany({
            where: {
              messageId: chat.message_id,
            },
            select: {
              id: true,
              createdAt: true,
              status: true,
              messageId: true,
              userId: true,
              user: {
                select: BASE_USER_SELECTOR,
              },
            },
          })
        : null;

      if (chat.is_direct) {
        const chatUser = await this.prismaService.chatUser.findFirst({
          where: {
            NOT: {
              userId: userId,
            },
            chatId: chat.id,
          },
          include: {
            user: {
              select: {
                name: true,
                username: true,
                avatar: true,
                id: true,
              },
            },
          },
        });

        if (chatUser) {
          chat.icon = chatUser.user.avatar;
          chat.name = `${chatUser.user.name}<INTERNAL_SERVER_SPLITTER>${chatUser.user.id}`;
          chat.directUserMember = chatUser.user.id;
        }
      }

      parsedData.push(this.parser(chat, status));
    }
    return parsedData;
  }

  private parser(
    data: RawData,
    status:
      | Prisma.MessageStatusGetPayload<{
          select: {
            id: true;
            createdAt: true;
            status: true;
            messageId: true;
            userId: true;
            user: {
              select: {
                id: true;
                name: true;
                username: true;
                avatar: true;
              };
            };
          };
        }>[]
      | null,
  ): ChatMessageSub {
    const isActionMoreRecent =
      data.action_created_at &&
      (!data.message_created_at ||
        new Date(data.action_created_at) > new Date(data.message_created_at));

    if (isActionMoreRecent) {
      return {
        chat: {
          id: data.id,
          name: data.name,
          ownerId: data.owner_id,
          unreadMessages: isNaN(parseInt(data.unread_message_count))
            ? null
            : parseInt(data.unread_message_count),
          type: data.type,
          isDirect: data.is_direct,
          createdAt: data.created_at.toISOString(),
          icon: data.icon,
          directUserMember: data.directUserMember,
        },
        chatAction: {
          id: data.action_id,
          chatId: data.action_chat_id,
          action: data.action_action,
          user: {
            id: data.action_user_id,
            name: data.action_user_name,
            username: data.action_user_username,
            avatar: data.action_user_avatar,
          },
          actionAuthor: {
            id: data.action_author_id,
            name: data.action_author_name,
            username: data.action_author_username,
            avatar: data.action_author_avatar,
          },
          message: data.action_message,
          createdAt: data.action_created_at.toISOString(),
        },
        message: null,
      };
    } else {
      return {
        chat: {
          id: data.id,
          name: data.name,
          ownerId: data.owner_id,
          unreadMessages: isNaN(parseInt(data.unread_message_count))
            ? null
            : parseInt(data.unread_message_count),
          type: data.type,
          isDirect: data.is_direct,
          createdAt: data.created_at.toISOString(),
          icon: data.icon,
          directUserMember: data.directUserMember,
        },
        chatAction: null,
        message: {
          id: data.message_id,
          content: data.message_content,
          hasMedia: data.message_has_media,
          createdAt: new Date(data.message_created_at).toISOString(),
          user: {
            id: data.message_user_id,
            name: data.message_user_name,
            username: data.message_user_username,
            avatar: data.message_user_avatar,
          },
          messageStatus: status,
        },
      };
    }
  }
}
