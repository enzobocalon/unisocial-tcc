import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { NotificationType } from './notification-type.entity';
import { NotificationStatus as PrismaNotificationStatus } from '.prisma/client';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Reply } from 'src/modules/replies/entities/reply.entity';

registerEnumType(PrismaNotificationStatus, {
  name: 'NotificationStatus',
});

@ObjectType()
export class Notification {
  @Field()
  id: string;

  @Field(() => [BaseUser])
  emitters: BaseUser[];

  @Field()
  message: string;

  @Field({ nullable: true })
  postId?: string;

  @Field({ nullable: true })
  replyId?: string;

  @Field({ nullable: true })
  assignmentId?: string;

  @Field({ nullable: true })
  taskId?: string;

  @Field(() => Int)
  typeId: number;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field({ nullable: true })
  friendshipId?: string;

  @Field()
  createdAt: string;

  @Field(() => Post, { nullable: true })
  post?: Post;

  @Field(() => Reply, { nullable: true })
  reply?: Reply;

  @Field(() => PrismaNotificationStatus)
  status: PrismaNotificationStatus;
}
