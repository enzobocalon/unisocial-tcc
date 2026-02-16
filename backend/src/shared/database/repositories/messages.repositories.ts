import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { PAGE_SIZE } from 'src/common/constants';

export type RawContentData = {
  id: string;
  user_id: string;
  message_content: string;
  system: boolean;
  created_at: Date;
  user_name: string;
  user_avatar: string;
  user_username: string;
  action: string;
  action_author_id: string;
  action_author_name: string;
  action_author_avatar: string;
  action_author_username: string;
  media_urls: string[];
  message_status: 'READ' | 'UNREAD';
};

@Injectable()
export class MessageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.MessageCreateArgs) {
    return this.prismaService.message.create(createDto);
  }

  findUnique(findUniqueDto: Prisma.MessageFindUniqueArgs) {
    return this.prismaService.message.findUnique(findUniqueDto);
  }

  findMany(findManyDto: Prisma.MessageFindManyArgs) {
    return this.prismaService.message.findMany(findManyDto);
  }

  delete(deleteDto: Prisma.MessageDeleteArgs) {
    return this.prismaService.message.delete(deleteDto);
  }

  async getContent(chatId: string, userId: string, page: number) {
    const data = await this.prismaService.$queryRaw<RawContentData[]>`
      WITH total_users AS (
        SELECT chat_id, COUNT(*) AS user_count
        FROM chat_users
        GROUP BY chat_id
      ),
      message_read_status AS (
        SELECT
          ms.message_id,
          COUNT(*) AS read_count
        FROM message_status ms
        WHERE ms.status = 'READ'
        GROUP BY ms.message_id
      )
      SELECT
          m.id,
          m.user_id,
          NULL as action,
          m.content AS message_content,
          false AS system,
          m.created_at,
          u.id as user_id,
          u.name AS user_name,
          u.avatar AS user_avatar,
          u.username AS user_username,
          NULL as action_author_id,
          NULL AS action_author_name,
          NULL AS action_author_avatar,
          NULL AS action_author_username,
          CASE
            WHEN COALESCE(mr.read_count, 0) = tu.user_count THEN 'READ'
            ELSE 'UNREAD'
          END AS message_status,
          ARRAY_AGG(ma.url) AS media_urls
      FROM messages m
      JOIN users u ON u.id = m.user_id
      LEFT JOIN medias ma ON ma.message_id = m.id
      LEFT JOIN total_users tu ON tu.chat_id = m.chat_id
      LEFT JOIN message_read_status mr ON mr.message_id = m.id
      WHERE m.chat_id = ${chatId}
      GROUP BY 
          m.id, m.user_id, m.content, m.created_at, u.id, u.name, u.avatar, u.username, tu.user_count, mr.read_count
      UNION ALL
      SELECT
          ca.id,
          ca.user_id,
          ca.action::text as action,
          ca.message AS message_content,
          true AS system,
          ca.created_at,
          u.id as user_id,
          u.name AS user_name,
          u.avatar AS user_avatar,
          u.username AS user_username,
          a.id as action_author_id,
          a.name AS action_author_name,
          a.avatar AS action_author_avatar,
          a.username AS action_author_username,
          NULL as message_status,
          NULL as media_urls
      FROM chat_actions ca
      JOIN users u ON u.id = ca.user_id
      JOIN users a ON a.id = ca.action_author_id
      WHERE ca.chat_id = ${chatId}
      ORDER BY created_at DESC
      LIMIT ${PAGE_SIZE} OFFSET ${page * 10};

    `;
    return data;
  }
}
