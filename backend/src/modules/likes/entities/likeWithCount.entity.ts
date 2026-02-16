import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class LikeWithCount {
  @Field(() => [BaseUser])
  like: BaseUser[];

  @Field(() => Int)
  count: number;
}
