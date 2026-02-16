import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class ShareListEntity {
  @Field(() => String)
  id: string;

  @Field(() => BaseUser)
  user: BaseUser;
}

@ObjectType()
export class ShareListWithCount {
  @Field(() => [ShareListEntity])
  share: () => ShareListEntity;

  @Field(() => Int)
  count: number;
}
