import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { ResponseEntity } from 'src/entities/response.entity';
import { LikeableEntities } from 'src/entities/actions.entity';
import { BaseUser } from '../users/entities/baseUser.entity';
import { Post } from '../posts/entities/post.entity';
import { LikeWithCount } from './entities/likeWithCount.entity';

@Resolver()
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => ResponseEntity, {
    name: 'likePost',
    description: 'Like a post',
  })
  async likePost(
    @Args('id') id: string,
    @Args('entity') entity: LikeableEntities,
    @ActiveUserId() userId: string,
  ) {
    return this.likesService.like(id, entity, userId);
  }

  @Query(() => LikeWithCount, {
    name: 'getLikeByPostId',
    description: 'Get all likes by post id',
  })
  async getLikeByPostId(
    @Args('id') postId: string,
    @Args('page') page: number,
  ) {
    return this.likesService.getLikeByPostId(postId, page);
  }

  @Query(() => [Post])
  async getPostLikesByUserId(
    @Args('id') id: string,
    @Args('page') page: number,
    @ActiveUserId() userId: string,
  ) {
    return this.likesService.getPostLikesByUserId(id, page, userId);
  }

  @Mutation(() => ResponseEntity, {
    name: 'unlikePost',
    description: 'Unlike a post',
  })
  async unlikePost(
    @Args('id') id: string,
    @Args('entity') entity: LikeableEntities,
    @ActiveUserId() userId: string,
  ) {
    return this.likesService.unlike(id, entity, userId);
  }

  // @Query(() => [
  //   Post,
  //   {
  //     name: 'getLikesbyUserList',
  //     description: 'Get all likes by user id',
  //   },
  // ])
  // async getLikesbyUserList(@ActiveUserId() id: string) {
  //   return this.likesService.getByUserList(id);
  // }
}
