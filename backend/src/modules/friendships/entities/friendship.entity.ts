import { ObjectType, Field } from '@nestjs/graphql';
import { FriendshipStatusEnum } from './friendship-status.entity';

@ObjectType()
export class Friendship {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  friendId: string;

  @Field(() => FriendshipStatusEnum)
  status: FriendshipStatusEnum;
}
