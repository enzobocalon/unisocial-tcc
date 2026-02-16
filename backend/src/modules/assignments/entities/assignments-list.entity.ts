import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class AssignmentListItem {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  icon?: string;

  @Field()
  dueDate: string;

  @Field(() => Boolean)
  isPending: boolean;

  @Field(() => Int, { nullable: true })
  pendingCount?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}

@ObjectType()
export class AssignmentList {
  @Field(() => Date)
  dueDate: Date;

  @Field(() => [AssignmentListItem])
  item: AssignmentListItem[];
}
