import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReplyDTO {
  @Field()
  postId: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => [String], { nullable: true })
  medias?: string[];
}
