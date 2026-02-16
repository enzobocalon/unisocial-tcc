import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { FriendshipsService } from './friendships.service';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { CreateFriendshipDTO } from './dto/create-friendship.dto';
import { ResponseEntity } from 'src/entities/response.entity';
import { BaseUser } from '../users/entities/baseUser.entity';
import { UserStatus } from '../users/entities/user-status.entity';
import { AlphabeticalFriendsResponse } from './entities/alphabetical-friends.entity';
import { FriendshipStatusEnum } from './entities/friendship-status.entity';

@Resolver()
export class FriendshipsResolver {
  constructor(private readonly friendshipService: FriendshipsService) {}

  @Mutation(() => ResponseEntity, {
    name: 'createFriendship',
    description: 'Create a new friendship',
  })
  createFriendship(
    @Args('data') data: CreateFriendshipDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.friendshipService.create(userId, data);
  }

  @Mutation(() => ResponseEntity, {
    name: 'acceptFriendship',
    description: 'Accept a friendship',
  })
  acceptFriendship(@Args('id') id: string, @ActiveUserId() userId: string) {
    return this.friendshipService.accept(id, userId);
  }

  @Mutation(() => ResponseEntity, {
    name: 'deleteFriendship',
    description: 'Delete a friendship',
  })
  deleteFriendship(@Args('id') id: string, @ActiveUserId() userId: string) {
    return this.friendshipService.delete(id, userId);
  }

  @Query(() => [BaseUser], {
    name: 'getAllFriends',
    description: 'Get all friends from active user',
  })
  getAllFriends(@ActiveUserId() userId: string, @Args('page') page: number) {
    return this.friendshipService.getAllFriends(userId, page);
  }

  @Query(() => [BaseUser], {
    name: 'getAllOnlineFriends',
    description: 'Get all online friends from active user',
  })
  getAllOnlineFriends(@ActiveUserId() userId: string) {
    return this.friendshipService.getOnlineFriends(userId);
  }

  @Query(() => AlphabeticalFriendsResponse, {
    name: 'getAllFriendsAlphabetically',
    description:
      'Get all friends from active user sorted by alphabetical order',
  })
  getAllFriendsAlphabetically(
    @ActiveUserId() userId: string,
    @Args('page') page: number,
  ) {
    return this.friendshipService.getAllFriendsAlphabetical(userId, page);
  }

  @Mutation(() => AlphabeticalFriendsResponse, {
    name: 'searchFriendsAlphabetically',
    description:
      'Search friends by name from active user sorted by alphabetical order',
  })
  searchFriendsAlphabetically(
    @ActiveUserId() userId: string,
    @Args('page') page: number,
    @Args('value') value: string,
  ) {
    return this.friendshipService.searchFriendsAlphabetically(
      userId,
      page,
      value,
    );
  }

  @Query(() => FriendshipStatusEnum)
  getFriendRequestStatus(
    @ActiveUserId() userId: string,
    @Args('id') id: string,
  ) {
    return this.friendshipService.getFriendRequestStatus(userId, id);
  }

  @Subscription(() => UserStatus, {
    name: 'friendStatus',
    description: 'Subscribes to friends status socket',
  })
  friendStatus(@ActiveUserId() userId: string) {
    return this.friendshipService.getFriendsStatus(userId);
  }
}
