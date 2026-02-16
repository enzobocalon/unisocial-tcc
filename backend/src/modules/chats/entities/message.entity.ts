import { Field, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { MessageStatus } from './message-status.entity';
import { Media } from 'src/modules/posts/entities/media.entity';

@ObjectType()
export class Message {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field(() => BaseUser)
  user: BaseUser;

  @Field()
  createdAt: string;

  @Field(() => Boolean)
  hasMedia: boolean;

  @Field(() => [Media], { nullable: true })
  media?: Media[];

  @Field({ nullable: true })
  deletedAt?: string;

  @Field(() => [MessageStatus], { nullable: true })
  messageStatus?: MessageStatus[];
}
