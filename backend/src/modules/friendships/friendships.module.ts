import { Module } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { FriendshipsResolver } from './friendships.resolver';

@Module({
  providers: [FriendshipsResolver, FriendshipsService],
  exports: [FriendshipsService],
})
export class FriendshipsModule {}
