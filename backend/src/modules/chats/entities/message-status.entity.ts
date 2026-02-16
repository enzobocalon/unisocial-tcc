import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { MessageStatusEnum as PrismaMessageEnum } from '.prisma/client';

registerEnumType(PrismaMessageEnum, {
  name: 'MessageStatusEnum',
});

export const MessageStatusEnum = PrismaMessageEnum;

@ObjectType()
export class MessageStatus {
  @Field()
  messageId: string;

  @Field(() => BaseUser)
  user: BaseUser;

  @Field()
  userId: string;

  @Field(() => PrismaMessageEnum)
  status: PrismaMessageEnum;
}
