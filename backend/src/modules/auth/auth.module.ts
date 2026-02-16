import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/config/env';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: env.jwtSecret,
      signOptions: {
        expiresIn: '7d',
      },
    }),
    EmailsModule,
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
