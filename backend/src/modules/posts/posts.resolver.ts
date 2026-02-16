import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post, {
    name: 'createPost',
    description: 'Create a new post',
  })
  createPost(
    @Args('data') data: CreatePostDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.postsService.create(data, userId);
  }

  @Query(() => [Post], { name: 'timeline' })
  findAll(
    @Args('page', { nullable: true }) page: number,
    @ActiveUserId() userId: string,
  ) {
    return this.postsService.findAll(userId, page);
  }

  @Query(() => [Post], { name: 'timelineByCourse' })
  findAllByCourse(@Args('page') page: number, @ActiveUserId() userId: string) {
    return this.postsService.findAllByCourse(userId, page);
  }

  @Query(() => [Post], {
    name: 'getPostByUserId',
    description: 'Find a post by userId',
  })
  findPostByUser(
    @ActiveUserId() userId: string,
    @Args('id') id: string,
    @Args('page') page: number,
    @Args('getShare', { nullable: true }) getShare?: boolean,
  ) {
    return this.postsService.findByUser(id, page, userId, getShare);
  }

  @Query(() => Post, {
    name: 'postById',
    description: 'Find a post by id',
  })
  findById(@Args('id') id: string, @ActiveUserId() userId: string) {
    return this.postsService.findById(id, userId);
  }

  @Query(() => [Post])
  findPostMediaByUserId(
    @Args('id') id: string,
    @Args('page') page: number,
    @ActiveUserId() userId: string,
  ) {
    return this.postsService.findPostMediaByUserId(id, page, userId);
  }

  @Mutation(() => Post, {
    name: 'updatePost',
    description: 'Update a post',
  })
  update(
    @Args('updatePost') data: UpdatePostDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.postsService.update(data, userId);
  }

  @Mutation(() => Post)
  removePost(@Args('id') id: string, @ActiveUserId() userId: string) {
    return this.postsService.remove(id, userId);
  }
}
