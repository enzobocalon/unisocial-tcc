import { Field, ObjectType } from '@nestjs/graphql';
import { BaseUser } from './baseUser.entity';

@ObjectType()
export class UserStatus extends BaseUser {
  @Field()
  online: boolean;
}
