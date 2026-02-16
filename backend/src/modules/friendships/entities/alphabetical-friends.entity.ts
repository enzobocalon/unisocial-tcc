import { ObjectType, Field } from '@nestjs/graphql';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class AlphabeticalFriendsResponse {
  @Field(() => GraphQLJSON)
  data: { [key: string]: BaseUser[] }; // A chave é a letra (string), o valor é um array de BaseUser

  @Field(() => Boolean)
  hasNextPage: boolean;
}
