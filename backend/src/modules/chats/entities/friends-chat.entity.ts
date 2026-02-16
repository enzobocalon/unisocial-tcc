import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class BaseUserExtended extends BaseUser {
  @Field()
  isMember: boolean;
}

@ObjectType()
export class ChatFriend {
  @Field(() => [BaseUserExtended])
  friends: BaseUserExtended[];

  @Field()
  letter: string;
}

@ObjectType()
export class ChatFriends {
  @Field(() => [ChatFriend])
  data: ChatFriend[];

  @Field(() => Int)
  count: number;

  @Field()
  hasNextPage: boolean;
}
