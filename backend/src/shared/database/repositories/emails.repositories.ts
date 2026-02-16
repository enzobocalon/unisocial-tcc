import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EmailRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create(createDto: Prisma.EmailTokenCreateArgs) {
    return this.prismaService.emailToken.create(createDto);
  }

  findUnique(findUniqueDto: Prisma.EmailTokenFindUniqueArgs) {
    return this.prismaService.emailToken.findUnique(findUniqueDto);
  }

  delete(deleteDto: Prisma.EmailTokenDeleteArgs) {
    return this.prismaService.emailToken.delete(deleteDto);
  }

  deleteMany(deleteManyDto: Prisma.EmailTokenDeleteManyArgs) {
    return this.prismaService.emailToken.deleteMany(deleteManyDto);
  }
}
