import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/config/env';
import { ResponseEntity } from 'src/entities/response.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { EmailRepository } from 'src/shared/database/repositories/emails.repositories';
import { UsersRepository } from 'src/shared/database/repositories/user.repositories';
import { transport } from 'src/shared/email';

@Injectable()
export class EmailService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepo: UsersRepository,
    private readonly emailsRepo: EmailRepository,
  ) {}

  async sendConfirmation(userId: string): Promise<ResponseEntity> {
    const user = await this.usersRepo.findUnique({
      where: {
        id: userId,
      },
    });
    if (user.verified) {
      throw new ForbiddenException('Usuario já está verificado');
    }
    const token = await this.emailsRepo.findUnique({
      where: {
        userId,
      },
    });
    if (!token) {
      const success = await this.createAndSendEmail(user);
      return {
        message: success
          ? 'E-mail enviado com sucesso'
          : 'Erro ao enviar e-mail',
        success,
      };
    }

    try {
      await this.jwtService.verifyAsync(token.token, {
        secret: env.emailSecret,
      });
      const success = await this.sendEmail(user, token.token);
      return {
        message: success
          ? 'E-mail enviado com sucesso'
          : 'Erro ao enviar e-mail',
        success,
      };
    } catch {
      try {
        await this.emailsRepo.delete({
          where: {
            id: token.id,
          },
        });
        const success = await this.createAndSendEmail(user);
        return {
          message: success
            ? 'E-mail enviado com sucesso'
            : 'Erro ao enviar e-mail',
          success,
        };
      } catch {
        throw new InternalServerErrorException('Falha ao enviar e-mail');
      }
    }
  }

  async confirm(token: string): Promise<ResponseEntity> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: env.emailSecret,
      });
      if (!payload) {
        await this.emailsRepo.deleteMany({
          where: {
            token,
          },
        });
        throw new ForbiddenException('Token inválido.');
      }

      const isValidToken = await this.emailsRepo.findUnique({
        where: {
          token,
          userId: payload.sub,
        },
      });

      if (!isValidToken) {
        await this.emailsRepo.delete({
          where: {
            userId: payload.sub,
          },
        });
        throw new ForbiddenException('Token inválido.');
      }

      await this.usersRepo.update({
        where: {
          id: payload.sub,
        },
        data: {
          verified: true,
        },
      });

      return {
        message: 'Conta verificada com sucesso',
        success: true,
      };
    } catch {
      throw new ForbiddenException('Token inválido.');
    }
  }

  private async createAndSendEmail(user: User): Promise<boolean> {
    try {
      const newToken = await this.generateToken(user.id);
      const created = await this.emailsRepo.create({
        data: {
          token: newToken,
          userId: user.id,
        },
      });
      if (!created) return false;
      const emailSent = await this.sendEmail(user, newToken);
      return emailSent;
    } catch {
      return false;
    }
  }

  private async sendEmail(user: User, token: string): Promise<boolean> {
    try {
      await transport.sendMail({
        from: 'unisocial@gmail.com',
        to: user.emailInst,
        subject: 'Verificação de e-mail',
        html: `
        <h1>Olá ${user.name}</h1>
        <p>Para verificar seu e-mail, clique no link abaixo:</p>
        <a href="http://localhost:3000/emails/verify?token=${token}">Verificar e-mail</a>
      `,
      });
      return true;
    } catch {
      console.log('Erro ao enviar e-mail');
      return false;
    }
  }

  private generateToken(userId: string) {
    return this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        secret: env.emailSecret,
        expiresIn: '1d',
      },
    );
  }
}
