import { Field, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { Assignment } from './assignment.entity';

@ObjectType()
export class AssignmentsUsers {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => BaseUser)
  user: BaseUser;

  @Field()
  assignmentId: string;

  @Field(() => Assignment, { nullable: true })
  assignment?: Assignment;

  @Field(() => Boolean)
  isAdmin: boolean;
}
