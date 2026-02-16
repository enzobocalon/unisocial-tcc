import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAssignmentTaskDTO {
  @Field()
  taskId: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Date, { nullable: true })
  dueDate?: Date;
}
