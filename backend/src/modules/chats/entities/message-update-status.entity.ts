import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class MessageUpdateStatus {
  @Field(() => String)
  id: string;

  @Field(() => String)
  chatId: string;
}
