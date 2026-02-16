import { ObjectType, Field } from '@nestjs/graphql';
import { Media } from './media.entity';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { Mention } from 'src/modules/mentions/entities/mention.entity';

@ObjectType()
export class Parent {
  @Field()
  id: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Boolean)
  hasMedia: boolean;

  @Field(() => [Media], { nullable: true })
  media?: Media[];

  @Field(() => BaseUser)
  user: BaseUser;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [Mention], { nullable: true })
  mentions?: Mention[];
}
