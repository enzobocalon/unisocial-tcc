import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProfileDTO {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  banner?: string;

  @Field({ nullable: true })
  courseId: string;
}
