import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SigninDTO {
  @Field()
  email: string;

  @Field()
  password: string;
}
