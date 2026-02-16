import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRemoveUserAssignmentDTO {
  @Field()
  assignmentId: string;

  @Field(() => [String], { nullable: true })
  usersIds?: string[];

  @Field({ nullable: true })
  userIdToRemove?: string;
}
