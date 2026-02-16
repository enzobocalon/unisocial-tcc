import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserAssignmentDTO {
  @Field()
  assignmentId: string;

  @Field()
  userId: string;

  @Field()
  isAdmin: boolean;
}
