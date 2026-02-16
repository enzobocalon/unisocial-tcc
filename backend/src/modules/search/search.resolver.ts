import { Args, Query, Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { SearchResult } from './entities/search.entity';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { BaseUser } from '../users/entities/baseUser.entity';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => SearchResult)
  async search(
    @Args('query') query: string,
    @Args('page') page: number,
    @ActiveUserId() userId: string,
  ) {
    return this.searchService.search(query, page, userId);
  }

  @Query(() => [BaseUser])
  async searchUsers(
    @Args('query') query: string,
    @Args('page') page: number,
    @ActiveUserId() userId: string,
  ) {
    return this.searchService.searchUsers(query, page, userId);
  }
}
