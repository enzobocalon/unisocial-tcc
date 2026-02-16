import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Media } from 'src/modules/posts/entities/media.entity';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class Reply {
  @Field()
  id: string;

  @Field()
  postId: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => [Media], { nullable: true })
  medias?: Media[];

  @Field(() => Int)
  likes: number;

  @Field(() => Int)
  replies: number;

  @Field(() => Boolean)
  liked: boolean;

  @Field(() => [BaseUser], { nullable: true })
  mentions?: BaseUser[];

  @Field(() => BaseUser)
  user: BaseUser;

  @Field(() => Date)
  createdAt: Date;
}
