import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateReplyDTO } from './create-reply.dto';

@InputType()
export class UpdateReplyDTO extends PartialType(CreateReplyDTO) {
  @Field()
  id: string;
}
