import { Field, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { TaskFiles } from './task-files.entity';

@ObjectType()
export class FileUser {
  @Field(() => String)
  id: string;

  @Field(() => BaseUser)
  user: BaseUser;
}

@ObjectType()
export class TaskAllFiles {
  @Field(() => FileUser)
  user: FileUser;

  @Field(() => [TaskFiles])
  files: TaskFiles[];
}
