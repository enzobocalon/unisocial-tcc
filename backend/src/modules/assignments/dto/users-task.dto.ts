import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserTaskDTO {
  @Field()
  taskId: string;

  @Field(() => [String])
  userIds: string[];
}
