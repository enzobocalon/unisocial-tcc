import { Field, InputType } from '@nestjs/graphql';
import { ChatType as PrismaChatType } from '.prisma/client';

@InputType()
export class UpdateChatDTO {
  @Field()
  chatId: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field(() => PrismaChatType, { nullable: true })
  type?: PrismaChatType;
}
