import { Field, ObjectType } from '@nestjs/graphql';
import { Assignment } from './assignment.entity';
import { AssignmentTask } from './assignment-task.entity';

@ObjectType()
export class TaskUsersIds {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  id: string;
}

@ObjectType()
export class TaskSub {
  @Field(() => Assignment)
  assignment: Assignment;

  @Field(() => AssignmentTask)
  task: AssignmentTask;

  @Field(() => String)
  action: string;

  @Field(() => [TaskUsersIds], { nullable: true })
  ids?: TaskUsersIds[];
}
