import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostDTO {
  @Field({ nullable: true })
  content?: string;

  @Field(() => [String], { nullable: true })
  medias?: string[];
}
