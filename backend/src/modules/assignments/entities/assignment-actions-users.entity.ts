import { Field, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { AssignmentAction } from '../dto/assignment-action.dto';

@ObjectType()
export class AssignmentActionUsers {
  @Field()
  id: string;

  @Field(() => AssignmentAction)
  assignmentAction: AssignmentAction;

  @Field(() => BaseUser, { nullable: true })
  user: BaseUser;

  @Field(() => Date)
  createdAt: Date;
}
