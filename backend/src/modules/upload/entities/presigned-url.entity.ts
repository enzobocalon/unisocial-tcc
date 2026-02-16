import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PresignedUrl {
  @Field()
  filename: string;

  @Field()
  uploadUrl: string;

  @Field()
  type: string;

  @Field()
  fileUrl: string;
}
