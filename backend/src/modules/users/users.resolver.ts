import {
  Resolver,
  Query,
  Subscription,
  Context,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { BaseUser } from './entities/baseUser.entity';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { SubscriptionConnection } from 'src/common/providers/connection.provider';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ResponseEntity } from 'src/entities/response.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => BaseUser)
  async me(@ActiveUserId() userId: string) {
    return await this.usersService.getUser(userId, false);
  }

  @Query(() => [BaseUser])
  async getUsersById(
    @Args('ids', { type: () => [String] }) ids: string[],
    @Args('page') page: number,
    @ActiveUserId() userId: string,
  ) {
    return await this.usersService.getUsersById(ids, page, userId);
  }

  @Mutation(() => BaseUser)
  updateUser(
    @ActiveUserId() userId: string,
    @Args('data') data: UpdateUserDTO,
  ) {
    return this.usersService.updateUser(userId, data);
  }

  @Mutation(() => BaseUser)
  async updateProfile(
    @ActiveUserId() userId: string,
    @Args('data') data: UpdateProfileDTO,
  ) {
    return await this.usersService.updateProfile(userId, data);
  }

  @Subscription(() => BaseUser, {
    name: 'userStatus',
    description: 'Send user current status (online/offline)',
  })
  async userStatus(
    @ActiveUserId() userId: string,
    @Context() context: { req: SubscriptionConnection },
  ) {
    // Subscribes to keep track of user's online status
    return this.usersService.userStatus(userId, context.req);
  }

  @Query(() => BaseUser)
  async getUserProfile(@Args('id') id: string, @ActiveUserId() userId: string) {
    return await this.usersService.getProfile(id, userId);
  }

  @Query(() => ResponseEntity)
  async heartbeat(@ActiveUserId() userId: string) {
    return await this.usersService.handleHeartbeat(userId);
  }
}
