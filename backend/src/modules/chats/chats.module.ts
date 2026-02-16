import { Module } from '@nestjs/common';
import { ChatsService } from './services/chats.service';
import { ChatsResolver } from './chats.resolver';
import { MessageService } from './services/message.service';
import { FriendshipsModule } from '../friendships/friendships.module';
import { UsersModule } from '../users/users.module';
import { UploadModule } from '../upload/upload.module';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
  imports: [FriendshipsModule, UsersModule, UploadModule, AssignmentsModule],
  providers: [ChatsResolver, ChatsService, MessageService],
})
export class ChatsModule {}
