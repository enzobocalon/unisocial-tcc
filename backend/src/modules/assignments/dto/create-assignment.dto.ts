import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAssignmentDTO {
  @Field()
  name: string;

  @Field({ nullable: true })
  icon?: string;

  @Field(() => [String], { nullable: true })
  usersIds?: string[];
}
