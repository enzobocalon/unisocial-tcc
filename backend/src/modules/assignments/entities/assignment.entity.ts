import { Field, ObjectType } from '@nestjs/graphql';
import { Media } from 'src/modules/posts/entities/media.entity';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class Assignment {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  icon: string;

  @Field()
  ownerId: string;

  @Field(() => [BaseUser], { nullable: true })
  users?: BaseUser[];

  @Field(() => String)
  createdAt: string;

  @Field(() => Media, { nullable: true })
  media?: Media;

  @Field(() => Boolean, { nullable: true })
  isAdmin?: boolean;

  @Field(() => String, { nullable: true })
  chatId?: string;
}
