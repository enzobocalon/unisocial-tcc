import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Media } from './media.entity';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { Actions } from 'src/entities/actions.entity';
import { Mention } from 'src/modules/mentions/entities/mention.entity';
import { Parent } from './parent.entity';

@ObjectType()
export class Post {
  // isShared => verifica se o post é compartilhado
  // shared => verifica se o post é compartilhado PELO USUARIO ATIVO

  @Field()
  id: string;

  // Identificação no front
  @Field({ nullable: true })
  key?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Boolean)
  hasMedia: boolean;

  @Field(() => Boolean)
  isShared: boolean;

  @Field(() => [Media], { nullable: true })
  media?: Media[];

  @Field(() => BaseUser)
  user: BaseUser;

  @Field(() => Int)
  likes: number;

  @Field(() => Int)
  replies: number;

  @Field(() => Int)
  shares: number;

  @Field(() => Boolean)
  liked: boolean;

  @Field(() => Boolean)
  shared: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Parent, { nullable: true })
  parent?: Parent;

  @Field(() => String, { nullable: true })
  parentId?: string;

  @Field(() => [Actions], {
    nullable: true,
  })
  actions?: Actions[];

  @Field(() => [Mention], { nullable: true })
  mentions?: Mention[];
}
