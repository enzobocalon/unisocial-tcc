import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SignupDTO {
  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Int)
  RA: number;

  @Field()
  courseId: string;
}
