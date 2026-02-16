import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ChatActionsEnum as PrismaChatActionEnum } from '.prisma/client';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { AssignmentActionUsers } from '../entities/assignment-actions-users.entity';

registerEnumType(PrismaChatActionEnum, {
  name: 'ChatActionEnum',
});

@ObjectType()
export class AssignmentAction {
  @Field()
  id: string;

  @Field(() => PrismaChatActionEnum)
  action: PrismaChatActionEnum;

  @Field({ nullable: true })
  message?: string;

  @Field()
  assignmentId: string;

  @Field(() => [AssignmentActionUsers], { nullable: true })
  users?: AssignmentActionUsers[];

  @Field(() => BaseUser, { nullable: true })
  actionAuthor?: BaseUser;

  @Field(() => Date)
  createdAt: Date;
}
