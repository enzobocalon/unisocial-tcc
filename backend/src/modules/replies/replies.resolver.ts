import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { RepliesService } from './replies.service';
import { Reply } from './entities/reply.entity';
import { CreateReplyDTO } from './dto/create-reply.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { UpdateReplyDTO } from './dto/update-reply.dto';
import { ResponseEntity } from 'src/entities/response.entity';

@Resolver()
export class RepliesResolver {
  constructor(private readonly repliesService: RepliesService) {}

  @Mutation(() => Reply, {
    name: 'createReply',
    description: 'Create a reply',
  })
  createReply(
    @Args('data') createReplyDTO: CreateReplyDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.repliesService.create(createReplyDTO, userId);
  }

  @Mutation(() => Reply, {
    name: 'updateReply',
    description: 'Update a reply',
  })
  updateReply(
    @Args('data') updateReplyDTO: UpdateReplyDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.repliesService.update(updateReplyDTO, userId);
  }

  @Mutation(() => ResponseEntity, {
    name: 'deleteReply',
    description: 'Delete a reply',
  })
  deleteReply(@Args('id') id: string, @ActiveUserId() userId: string) {
    return this.repliesService.delete(id, userId);
  }

  @Query(() => [Reply], {
    name: 'replies',
    description: 'Get replies for a post',
  })
  getReplies(
    @Args('id') postId: string,
    @Args('page') page: number,
    @ActiveUserId() userId: string,
  ) {
    return this.repliesService.getReplies(postId, userId, page);
  }

  @Query(() => [Reply], {
    name: 'getChildrenReplies',
    description: 'Get children replies for a reply',
  })
  getChildrenReplies(
    @Args('postId') postId: string,
    @Args('parentId') parentId: string,
    @Args('page') page: number,
    @ActiveUserId() userId: string,
  ) {
    return this.repliesService.getReplies(postId, userId, page, parentId);
  }

  // @Query(() => [Post], {
  //   name: 'getRepliesByUserList',
  // })
  // getRepliesByUserList(@ActiveUserId() userId: string) {
  //   return this.repliesService.getRepliesByUserList(userId);
  // }
}
