import { Field, InputType } from '@nestjs/graphql';
import { CreatePostDTO } from 'src/modules/posts/dto/create-post.dto';

@InputType()
export class CreateShareDTO extends CreatePostDTO {
  @Field()
  parentId: string;
}
