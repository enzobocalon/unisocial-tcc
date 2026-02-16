import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TaskFiles {
  @Field()
  id: string;

  @Field()
  taskId: string;

  @Field()
  userId: string;

  @Field()
  filename: string;

  @Field()
  type: string;

  @Field()
  url: string;
}
