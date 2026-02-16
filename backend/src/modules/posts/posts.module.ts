import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { LikesModule } from '../likes/likes.module';
import { SharesModule } from '../shares/shares.module';
import { RepliesModule } from '../replies/replies.module';
import { MentionsModule } from '../mentions/mentions.module';
import { FriendshipsModule } from '../friendships/friendships.module';
import { UploadModule } from '../upload/upload.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    LikesModule,
    SharesModule,
    RepliesModule,
    MentionsModule,
    FriendshipsModule,
    UploadModule,
    UsersModule,
  ],
  providers: [PostsResolver, PostsService],
  exports: [PostsService],
})
export class PostsModule {}
