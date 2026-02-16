import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddUserDTO {
  @Field(() => [String], { nullable: true })
  userToAddId?: string[];

  @Field()
  chatId: string;
}
