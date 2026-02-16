import { Field, ObjectType } from '@nestjs/graphql';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { ChatActionEntity } from './chat-action.entity';

@ObjectType()
export class ChatMessageSub {
  @Field(() => Chat)
  chat: Chat;

  @Field(() => Message, { nullable: true })
  message?: Message;

  @Field(() => ChatActionEntity, { nullable: true })
  chatAction?: ChatActionEntity;
}
