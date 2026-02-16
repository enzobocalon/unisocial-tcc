import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UploadTaskItem {
  @Field()
  filename: string;

  @Field()
  type: string;

  @Field()
  url: string;
}

@InputType()
export class UploadFileToTaskDTO {
  @Field()
  taskId: string;

  @Field(() => [UploadTaskItem])
  files: UploadTaskItem[];
}
