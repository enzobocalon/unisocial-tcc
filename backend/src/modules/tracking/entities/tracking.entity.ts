import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@ObjectType()
export class Tracking extends BaseUser {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => String, { nullable: true })
  building?: string;
}
