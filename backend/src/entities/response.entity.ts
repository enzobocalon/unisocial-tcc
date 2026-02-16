import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ResponseEntity {
  @Field({ nullable: true })
  message?: string;

  @Field()
  success: boolean;

  @Field({
    nullable: true,
    description: 'Any type of complementary data to this specific response.',
  })
  compl_data?: string;
}
