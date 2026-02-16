import { Field, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class TaskMember {
  @Field(() => String)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => Boolean)
  completed: boolean;

  @Field(() => BaseUser)
  user: BaseUser;
}
