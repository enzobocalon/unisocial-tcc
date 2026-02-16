import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

export enum LikeableEntities {
  REPLY = 'REPLY',
  POST = 'POST',
}

registerEnumType(LikeableEntities, {
  name: 'LikeableEntities',
});

@ObjectType()
export class Actions {
  @Field({ nullable: true })
  id: string;

  @Field()
  type: string;

  @Field(() => BaseUser, {
    nullable: true,
  })
  author: BaseUser;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
