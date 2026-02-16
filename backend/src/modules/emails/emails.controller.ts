import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './emails.service';
import { IsPublic } from 'src/shared/decorators/IsPublic';

@IsPublic()
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailService) {}

  @Get('verify')
  async confirm(@Query('token') token: string) {
    return await this.emailsService.confirm(token);
  }
}
