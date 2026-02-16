import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Media {
  @Field()
  id: string;

  @Field({ nullable: true })
  postId?: string;

  @Field({ nullable: true })
  replyId?: string;

  @Field({ nullable: true })
  shareId?: string;

  @Field({ nullable: true })
  messageId?: string;

  @Field()
  url: string;
}
