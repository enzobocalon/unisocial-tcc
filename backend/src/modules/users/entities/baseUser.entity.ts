import { ObjectType, Field } from '@nestjs/graphql';
import { Course } from 'src/modules/courses/entity/course.entity';
import { Friendship } from 'src/modules/friendships/entities/friendship.entity';

@ObjectType()
export class BaseUser {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  banner?: string;

  @Field({ nullable: true })
  course?: Course;

  @Field({ nullable: true })
  friendsCount?: number;

  @Field({ nullable: true })
  courseId?: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  friendship?: Friendship;
}
