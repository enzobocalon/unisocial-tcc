import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/modules/posts/entities/post.entity';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class SearchResult {
  @Field(() => [BaseUser], {
    nullable: true,
  })
  users?: BaseUser[];

  @Field(() => [Post], {
    nullable: true,
  })
  posts?: Post[];
}
