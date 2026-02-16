import { Field, InputType } from '@nestjs/graphql';
import { ChatType as PrismaChatType } from '.prisma/client';

@InputType()
export class CreateChatDTO {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field(() => PrismaChatType)
  type: PrismaChatType;

  @Field()
  isDirect: boolean;

  @Field(() => [String], { nullable: true })
  users?: string[];
}
