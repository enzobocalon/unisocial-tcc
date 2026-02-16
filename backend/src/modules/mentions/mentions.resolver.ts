import { Args, Query, Resolver } from '@nestjs/graphql';
import { BaseUser } from '../users/entities/baseUser.entity';
import { MentionsService } from './mentions.service';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';

@Resolver()
export class MentionsResolver {
  constructor(private readonly mentionsService: MentionsService) {}

  @Query(() => [BaseUser])
  async getMentionableUsers(
    @ActiveUserId() userId: string,
    @Args('content') content: string,
  ) {
    return this.mentionsService.getMentionableUsers(userId, content);
  }
}
