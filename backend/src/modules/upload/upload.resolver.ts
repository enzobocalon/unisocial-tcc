import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UploadService } from './upload.service';
import { UrlRequestDTO } from './dto/url-request-dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { PresignedUrl } from './entities/presigned-url.entity';

@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Mutation(() => [PresignedUrl])
  async generatePresignedUrls(
    @Args('data', { type: () => [UrlRequestDTO] }) files: UrlRequestDTO[],
    @ActiveUserId() userId: string,
  ) {
    return this.uploadService.generatePresignedUrls(files);
  }
}
