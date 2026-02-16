import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveFileFromTask {
  @Field()
  taskId: string;

  @Field(() => [String])
  filesIds: string[];
}
