import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreatePostDTO } from './create-post.dto';

@InputType()
export class UpdatePostDTO extends PartialType(CreatePostDTO) {
  @Field()
  id: string;
}
