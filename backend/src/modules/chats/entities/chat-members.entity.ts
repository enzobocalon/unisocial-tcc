import { Field, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class ChatMember {
  @Field()
  id: string;

  @Field()
  isAdmin: boolean;

  @Field(() => BaseUser)
  user: BaseUser;
}
