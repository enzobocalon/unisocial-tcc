import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { env } from 'src/config/env';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/IsPublic';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublic) return true;

    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: env.jwtSecret,
      });
      request['userId'] = payload.sub;
    } catch {
      throw new GraphQLError('Credencial Inválido', {
        extensions: { code: 'UNAUTHORIZED_TOKEN' },
      });
    }
    return true;
  }

  private extractTokenFromHeader(
    request: Request & {
      extra: { authorization: string };
    },
  ): string | undefined {
    const headerToken =
      request.headers?.authorization || request.extra?.authorization;
    if (!headerToken) return undefined;
    const [type, token] = headerToken.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
