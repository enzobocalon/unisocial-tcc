import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { TaskFiles } from './task-files.entity';

@ObjectType()
export class AssignmentTask {
  @Field()
  id: string;

  @Field()
  assignmentId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Boolean)
  completed: boolean;

  @Field()
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  dueDate?: Date;

  @Field()
  owner: BaseUser;

  @Field(() => String)
  ownerId: string;

  @Field(() => [TaskFiles])
  files: TaskFiles[];

  @Field(() => Boolean)
  isMember: boolean;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  completedCount: number;
}
