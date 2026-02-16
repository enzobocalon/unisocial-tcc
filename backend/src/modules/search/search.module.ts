import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { FriendshipsModule } from '../friendships/friendships.module';

@Module({
  imports: [UsersModule, PostsModule, FriendshipsModule],
  providers: [SearchResolver, SearchService],
})
export class SearchModule {}
