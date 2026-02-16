import { Module } from '@nestjs/common';
import { EmailService } from './emails.service';
import { EmailsController } from './emails.controller';

@Module({
  controllers: [EmailsController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailsModule {}
