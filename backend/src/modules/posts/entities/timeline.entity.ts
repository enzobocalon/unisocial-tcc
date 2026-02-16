import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Post } from './post.entity';

export enum Action {
  LIKE = 'LIKE',
  SHARE = 'SHARE',
  REPLY = 'REPLY',
}

registerEnumType(Action, {
  name: 'Action',
});

@ObjectType()
export class Timeline {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Action, {
    name: 'action',
    description: 'How user interacted with the post (like, share, reply)',
    nullable: true,
  })
  action?: Action;

  @Field({
    name: 'actionMessage',
    description: 'Message to describe the action',
    nullable: true,
  })
  actionMessage?: string;
}
