import { Field, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class Mention {
  @Field(() => BaseUser)
  user: BaseUser;
}
