import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum MediaSource {
  DEFAULT = 'DEFAULT',
  DOC = 'DOC',
  IMAGE_ONLY = 'IMAGE_ONLY',
}

registerEnumType(MediaSource, {
  name: 'MediaSource',
  description: 'Origem da mídia',
});

@InputType()
export class UrlRequestDTO {
  @Field(() => String)
  name: string;

  @Field(() => String)
  type: string;

  @Field(() => MediaSource)
  source: MediaSource;
}
