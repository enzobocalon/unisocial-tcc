import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageDTO {
  @Field({ nullable: true })
  assignmentId?: string;

  @Field({ nullable: true })
  chatId?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => [String], { nullable: true })
  medias?: string[];
}
