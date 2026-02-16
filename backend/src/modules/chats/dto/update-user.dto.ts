import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateChatUserDTO {
  @Field({ nullable: true })
  userToUpdateId?: string;

  @Field()
  chatId: string;

  @Field()
  isAdmin: boolean;
}
