import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveUserDTO {
  @Field({ nullable: true })
  userToRemoveId?: string;

  @Field()
  chatId: string;
}
