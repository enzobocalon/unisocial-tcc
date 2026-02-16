import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationType {
  @Field()
  name: string;

  @Field()
  defaultMessage: string;
}
