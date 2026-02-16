import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { BaseUser } from './baseUser.entity';

@ObjectType()
export class User extends BaseUser {
  @Field()
  emailInst: string;

  @Field(() => Int)
  RA: number;

  @Field(() => GraphQLISODateTime)
  lastSeen: Date;

  @Field()
  verified: boolean;

  @Field()
  courseId: string;
}
