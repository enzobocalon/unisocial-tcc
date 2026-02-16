import { Module } from '@nestjs/common';
import { MentionsService } from './mentions.service';
import { FriendshipsModule } from '../friendships/friendships.module';
import { MentionsResolver } from './mentions.resolver';

@Module({
  imports: [FriendshipsModule],
  exports: [MentionsService],
  providers: [MentionsResolver, MentionsService],
})
export class MentionsModule {}
