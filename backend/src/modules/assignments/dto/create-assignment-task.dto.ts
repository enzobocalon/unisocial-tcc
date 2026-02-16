import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAssignmentTaskDTO {
  @Field()
  assignmentId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Date, { nullable: true })
  dueDate?: Date;

  @Field(() => [String], { nullable: true })
  users?: string[];
}
