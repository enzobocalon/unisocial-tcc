import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAssignmentDTO {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  icon?: string;
}
