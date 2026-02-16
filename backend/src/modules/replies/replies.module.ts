import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesResolver } from './replies.resolver';
import { MentionsModule } from '../mentions/mentions.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [MentionsModule, UploadModule],
  providers: [RepliesResolver, RepliesService],
  exports: [RepliesService],
})
export class RepliesModule {}
