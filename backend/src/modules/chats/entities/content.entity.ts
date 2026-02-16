import { Field, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
class ContentMedia {
  @Field(() => [String], { nullable: 'itemsAndList' })
  urls?: (string | null)[] | null;
}

@ObjectType()
class ContentMessage {
  @Field()
  content: string;

  @Field()
  hasMedia: boolean;

  @Field(() => ContentMedia, { nullable: true })
  media?: ContentMedia;
}

@ObjectType()
class ContentAction {
  @Field()
  action: string;

  @Field()
  user: BaseUser;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType()
export class ChatContent {
  @Field()
  id: string;

  @Field()
  system: boolean;

  @Field()
  createdAt: Date;

  @Field(() => ContentMessage, { nullable: true })
  message: ContentMessage;

  @Field(() => ContentAction, { nullable: true })
  action: ContentAction;

  @Field(() => BaseUser)
  author: BaseUser;
}
