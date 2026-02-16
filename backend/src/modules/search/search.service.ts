import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { SearchResult } from './entities/search.entity';
import { FriendshipsService } from '../friendships/friendships.service';
import { PAGE_SIZE } from 'src/common/constants';

@Injectable()
export class SearchService {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly friendsService: FriendshipsService,
  ) {}

  async search(
    rawQuery: string,
    page: number,
    userId: string,
  ): Promise<SearchResult> {
    try {
      if (!rawQuery) return;
      const query = rawQuery.toLocaleLowerCase();
      const users = await this.searchUsers(query, page, userId);
      if (query.startsWith('@')) {
        return { users };
      }
      const posts = await this.postsService.getPostsByContent(
        query,
        page,
        userId,
      );

      // Search history to be client-sided.
      return {
        users,
        posts,
      };
    } catch (e) {
      console.log(e);
    }
  }

  async searchUsers(query: string, page: number, userId: string) {
    try {
      if (!query) return null;
      let username = query;
      if (query.startsWith('@')) {
        username = query.slice(0).replaceAll(' ', '').replaceAll('@', '');
      }

      const friends = await this.friendsService.getFriendsByUsernames(
        username,
        userId,
        page,
      );

      const combinedList = [...friends];

      if (friends.length < PAGE_SIZE) {
        const users = await this.usersService.getUsersByUsername(
          username,
          page,
          userId,
        );

        const combinedUsers = new Map();
        for (const friend of friends) {
          combinedUsers.set(friend.id, friend);
        }

        for (const user of users) {
          if (!combinedUsers.has(user.id)) {
            combinedList.push(user);
          }
        }

        return combinedList.slice(0, PAGE_SIZE);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
