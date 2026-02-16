import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ChatType as PrismaChatType } from '.prisma/client';

registerEnumType(PrismaChatType, {
  name: 'ChatType',
});

export type ChatType = PrismaChatType;

@ObjectType()
export class Chat {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => PrismaChatType)
  type: PrismaChatType;

  @Field()
  isDirect: boolean;

  @Field({ nullable: true })
  ownerId?: string;

  @Field(() => Int, { nullable: true })
  unreadMessages?: number;

  @Field(() => String)
  createdAt: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  isOnline?: boolean;

  @Field({ nullable: true })
  directUserMember?: string;

  @Field({ nullable: true })
  isAdmin?: boolean;
}
