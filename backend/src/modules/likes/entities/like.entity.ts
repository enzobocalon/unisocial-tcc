import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Like {
  @Field()
  id: string;
}
