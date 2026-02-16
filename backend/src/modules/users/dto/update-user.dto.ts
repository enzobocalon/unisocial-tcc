import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserDTO {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  confirmPassword?: string;

  @Field({ nullable: true })
  currentPassword?: string;
}
