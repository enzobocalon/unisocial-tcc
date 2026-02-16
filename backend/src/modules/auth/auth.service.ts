import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/shared/database/repositories/user.repositories';
import { SignupDTO } from './dto/signup.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Token } from './entities/token.entity';
import { SigninDTO } from './dto/signin.dto';
import { env } from 'src/config/env';
import { RefreshTokenRepository } from 'src/shared/database/repositories/refresh-tokens.repositories';
import { EmailService } from '../emails/emails.service';
import { ResponseEntity } from 'src/entities/response.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly emailService: EmailService,
  ) {}

  async signup(data: SignupDTO): Promise<ResponseEntity> {
    const { name, RA, email, password, courseId, username } = data;
    if (!this.checkEmailDomain(email)) {
      throw new BadRequestException('O e-mail deve ser institucional.');
    }
    const existsUser = await this.userRepo.findFirst({
      where: {
        OR: [{ emailInst: email, RA }],
      },
    });

    if (existsUser) {
      throw new ConflictException('Usuário já cadastrado');
    }

    const hashedPassword = await hash(password, 8);
    const user = await this.userRepo.create({
      data: {
        name,
        RA,
        username,
        emailInst: email,
        password: hashedPassword,
        courseId,
      },
    });

    await this.emailService.sendConfirmation(user.id);

    return {
      message:
        'Usuário cadastrado com sucesso. Verifique seu e-mail para ativar sua conta.',
      success: true,
    };
  }

  async signin(data: SigninDTO): Promise<Token> {
    const { email, password } = data;

    if (!this.checkEmailDomain(email)) {
      throw new BadRequestException('O e-mail deve ser institucional.');
    }

    const user = await this.userRepo.findFirst({
      where: {
        emailInst: email,
      },
    });
    if (!user) throw new UnauthorizedException('Credencias inválidas.');

    if (!user.verified) {
      await this.emailService.sendConfirmation(user.id);
      throw new UnauthorizedException(
        'Usuário não verificado. Verifique seu e-mail.',
      );
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credencias inválidas.');
    }

    const token = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    await this.refreshTokenRepo.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    return { token, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<Token> {
    if (!refreshToken) {
      throw new BadRequestException('Token não informado.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: env.refreshSecret,
      });

      if (!payload) {
        await this.refreshTokenRepo.deleteMany({
          where: {
            token: refreshToken,
          },
        });
        throw new UnauthorizedException('Token inválido.');
      }

      const isValidRefreshToken = await this.refreshTokenRepo.findFirst({
        where: {
          token: refreshToken,
          userId: payload.sub,
        },
      });

      if (!isValidRefreshToken) {
        await this.refreshTokenRepo.deleteMany({
          where: {
            userId: payload.sub,
          },
        });
        throw new UnauthorizedException('Token inválido.');
      }

      const token = await this.generateAccessToken(payload.sub);
      const newRefreshToken = await this.generateRefreshToken(payload.sub);

      await this.refreshTokenRepo.createAndDeleteToken(
        newRefreshToken,
        refreshToken,
        payload.sub,
      );
      return {
        token,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expirado.');
      }
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Ocorreu um erro interno.');
      }
    }
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.signAsync({
      sub: userId,
    });
  }

  private generateRefreshToken(userId: string) {
    return this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        secret: env.refreshSecret,
        expiresIn: '10d',
      },
    );
  }

  private checkEmailDomain(email: string) {
    const emailDomain = email.split('@')[1];
    return emailDomain === 'unifev.edu.br';
  }
}
