import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFriendshipDTO {
  @Field()
  friendId: string;
}
