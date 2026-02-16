import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class TaskAddableUser {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  user: BaseUser;

  @Field({ nullable: true })
  isMember?: boolean;
}

@ObjectType()
export class TaskAddableUsers {
  @Field(() => [TaskAddableUser])
  friends: TaskAddableUser[];

  @Field()
  letter: string;
}

@ObjectType()
export class TaskAddableUsersResponse {
  @Field(() => [TaskAddableUsers])
  data: TaskAddableUsers[];

  @Field()
  hasNextPage: boolean;

  @Field(() => Int)
  count: number;
}
