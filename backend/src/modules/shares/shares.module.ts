import { Module } from '@nestjs/common';
import { SharesService } from './shares.service';
import { SharesResolver } from './shares.resolver';
import { MentionsModule } from '../mentions/mentions.module';

@Module({
  imports: [MentionsModule],
  providers: [SharesResolver, SharesService],
  exports: [SharesService],
})
export class SharesModule {}
