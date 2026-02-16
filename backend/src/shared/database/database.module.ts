import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/user.repositories';
import { CourseRepository } from './repositories/courses.repositories';
import { PostRepository } from './repositories/posts.repositories';
import { MediaRepository } from './repositories/medias.repositories';
import { LikeRepository } from './repositories/likes.repositories';
import { FriendshipRepository } from './repositories/friendships.repositories';
import { ReplyRepository } from './repositories/replies.repositories';
import { MentionRepository } from './repositories/mentions.repositories';
import { NotificationTypeRepository } from './repositories/notifications/notifications-types.repositories';
import { NotificationRepository } from './repositories/notifications/notifications.repositories';
import { NotificationObjectRepository } from './repositories/notifications/notifications-objects.repositories';
import { NotificationSettingRepository } from './repositories/notifications/notification-settings.repositories';
import { RefreshTokenRepository } from './repositories/refresh-tokens.repositories';
import { EmailRepository } from './repositories/emails.repositories';
import { ChatRepository } from './repositories/chats.repositories';
import { ChatUsersRepository } from './repositories/chat-users.repositories';
import { MessageRepository } from './repositories/messages.repositories';
import { ChatActionRepository } from './repositories/chat-actions.repositories';
import { MessageStatusRepository } from './repositories/message-status.repositories';
import { AssignmentRepository } from './repositories/assignments/assignments.repositories';
import { AssignmentUserRepository } from './repositories/assignments/assignments-users.repositories';
import { AssignmentTaskRepository } from './repositories/assignments/assignments-tasks.repositories';
import { AssignmentTaskUserRepository } from './repositories/assignments/assignments-topics.repositories';
import { AssignmentTaskFileRepository } from './repositories/assignments/assignments-tasks-files.repositories';
import { TrackingRepository } from './repositories/tracking.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CourseRepository,
    PostRepository,
    MediaRepository,
    LikeRepository,
    FriendshipRepository,
    ReplyRepository,
    MentionRepository,
    NotificationTypeRepository,
    NotificationObjectRepository,
    NotificationRepository,
    NotificationSettingRepository,
    RefreshTokenRepository,
    EmailRepository,
    ChatRepository,
    ChatUsersRepository,
    MessageRepository,
    ChatActionRepository,
    MessageStatusRepository,
    AssignmentRepository,
    AssignmentUserRepository,
    AssignmentTaskRepository,
    AssignmentTaskUserRepository,
    AssignmentTaskFileRepository,
    TrackingRepository,
  ],
  exports: [
    UsersRepository,
    CourseRepository,
    PostRepository,
    MediaRepository,
    LikeRepository,
    FriendshipRepository,
    ReplyRepository,
    MentionRepository,
    NotificationTypeRepository,
    NotificationObjectRepository,
    NotificationRepository,
    NotificationSettingRepository,
    RefreshTokenRepository,
    EmailRepository,
    ChatRepository,
    ChatUsersRepository,
    MessageRepository,
    ChatActionRepository,
    MessageStatusRepository,
    AssignmentRepository,
    AssignmentUserRepository,
    AssignmentTaskRepository,
    AssignmentTaskUserRepository,
    AssignmentTaskFileRepository,
    TrackingRepository,
  ],
})
export class DatabaseModule {}
