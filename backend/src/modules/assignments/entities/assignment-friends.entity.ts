import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseUserExtended } from 'src/modules/chats/entities/friends-chat.entity';

@ObjectType()
export class AssignmentFriend {
  @Field(() => [BaseUserExtended])
  friends: BaseUserExtended[];

  @Field()
  letter: string;
}

@ObjectType()
export class AssignmentFriends {
  @Field(() => [AssignmentFriend])
  data: AssignmentFriend[];

  @Field(() => Int)
  count: number;

  @Field()
  hasNextPage: boolean;
}
