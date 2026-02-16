import { Field, ObjectType } from '@nestjs/graphql';
import { Assignment } from './assignment.entity';
import { AssignmentsUsers } from './assignment-users.entity';

@ObjectType()
export class AssignmentUserSub {
  @Field(() => Assignment)
  assignment: Assignment;

  @Field(() => AssignmentsUsers, { nullable: true })
  member?: AssignmentsUsers;

  @Field(() => String, { nullable: true })
  action?: string;
}
