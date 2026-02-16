import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchParams {
  @Field({ nullable: false })
  query: string;
}
