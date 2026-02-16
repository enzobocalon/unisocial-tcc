import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationObjectDTO {
  @Field()
  type: 'DEFAULT' | 'FRIENDSHIP';

  @Field({ nullable: true })
  postId?: string;

  @Field({ nullable: true })
  replyId?: string;

  @Field({ nullable: true })
  friendshipId?: string;

  @Field({ nullable: true })
  assignmentId?: string;

  @Field({ nullable: true })
  taskId?: string;
}

@InputType()
export class CreateNotificationObjectDTO {
  @Field(() => Int)
  typeId: number;

  @Field()
  emitterId: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => NotificationObjectDTO, { nullable: true })
  entity?: NotificationObjectDTO;
}
