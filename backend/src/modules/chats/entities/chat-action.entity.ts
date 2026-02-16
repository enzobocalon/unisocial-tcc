import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ChatActionsEnum as PrismaChatActionEnum } from '.prisma/client';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

registerEnumType(PrismaChatActionEnum, {
  name: 'ChatActionEnum',
});

@ObjectType()
class CustomChatBaseUser extends BaseUser {
  @Field(() => Boolean, { nullable: true })
  isAdmin?: boolean;
}

@ObjectType()
export class ChatActionEntity {
  @Field()
  id: string;

  @Field(() => String)
  action: string;

  @Field(() => PrismaChatActionEnum, { nullable: true })
  actionType?: PrismaChatActionEnum;

  @Field({ nullable: true })
  message?: string;

  @Field()
  chatId: string;

  @Field(() => CustomChatBaseUser, { nullable: true })
  user?: CustomChatBaseUser;

  @Field(() => BaseUser)
  actionAuthor: BaseUser;

  @Field(() => String)
  createdAt: string;
}
