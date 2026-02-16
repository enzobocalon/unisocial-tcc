import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.RefreshTokenCreateArgs) {
    return this.prismaService.refreshToken.create(createDto);
  }

  findFirst(findFirstDto: Prisma.RefreshTokenFindFirstArgs) {
    return this.prismaService.refreshToken.findFirst(findFirstDto);
  }

  delete(deleteDto: Prisma.RefreshTokenDeleteArgs) {
    return this.prismaService.refreshToken.delete(deleteDto);
  }

  deleteMany(deleteManyDto: Prisma.RefreshTokenDeleteManyArgs) {
    return this.prismaService.refreshToken.deleteMany(deleteManyDto);
  }

  createAndDeleteToken(token: string, oldToken: string, userId: string) {
    return this.prismaService.$transaction([
      this.prismaService.refreshToken.delete({
        where: {
          token: oldToken,
        },
      }),
      this.prismaService.refreshToken.create({
        data: {
          token,
          userId,
        },
      }),
    ]);
  }
}
