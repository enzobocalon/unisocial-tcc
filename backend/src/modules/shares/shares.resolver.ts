import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SharesService } from './shares.service';
import { ResponseEntity } from 'src/entities/response.entity';
import { CreateShareDTO } from './dto/create-share.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { Post } from '../posts/entities/post.entity';
import { ShareListWithCount } from './entities/ShareList';

@Resolver()
export class SharesResolver {
  constructor(private readonly sharesService: SharesService) {}

  @Mutation(() => Post)
  async share(
    @Args('data') data: CreateShareDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.sharesService.createShare(data, userId);
  }

  @Mutation(() => ResponseEntity)
  async unshare(
    @Args('postId') postId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.sharesService.deleteShare(postId, userId);
  }

  @Query(() => ShareListWithCount)
  async getShareByPostId(
    @Args('postId') postId: string,
    @Args('page') page: number,
  ) {
    return this.sharesService.getShareByPostId(postId, page);
  }
}
