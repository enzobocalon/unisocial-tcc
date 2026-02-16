import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class TrackingDataDto {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
}
