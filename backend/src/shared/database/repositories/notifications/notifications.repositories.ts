import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { Injectable } from '@nestjs/common';
import { BASE_USER_SELECTOR } from 'src/common/constants';
@Injectable()
export class NotificationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // createMany(createManyDto: Prisma.NotificationCreateManyArgs) {
  //   return this.prismaService.notification.createMany(createManyDto);
  // }

  createMany(
    notificationsDto: {
      receiverId: string;
      notificationObjectId: string;
    }[],
  ) {
    return this.prismaService.$transaction(
      notificationsDto.map((notification) =>
        this.prismaService.notification.create({
          data: notification,
          include: {
            notificationObject: {
              include: {
                emitter: {
                  select: BASE_USER_SELECTOR,
                },
                type: {
                  select: {
                    defaultMessage: true,
                    id: true,
                    name: true,
                  },
                },
                post: {
                  select: {
                    id: true,
                    content: true,
                    mentions: {
                      select: {
                        user: {
                          select: BASE_USER_SELECTOR,
                        },
                      },
                    },
                  },
                },
                reply: {
                  select: {
                    id: true,
                    content: true,
                    mentions: {
                      select: {
                        user: {
                          select: BASE_USER_SELECTOR,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      ),
    );
  }

  findMany(findManyDto: Prisma.NotificationFindManyArgs) {
    return this.prismaService.notification.findMany(findManyDto);
  }

  findFirst(findFirstDto: Prisma.NotificationFindFirstArgs) {
    return this.prismaService.notification.findFirst(findFirstDto);
  }

  delete(deleteDto: Prisma.NotificationDeleteArgs) {
    return this.prismaService.notification.delete(deleteDto);
  }

  updateMany(updateDto: Prisma.NotificationUpdateManyArgs) {
    return this.prismaService.notification.updateMany(updateDto);
  }

  count(countDto: Prisma.NotificationCountArgs) {
    return this.prismaService.notification.count(countDto);
  }

  deleteMany(deleteManyDto: Prisma.NotificationDeleteManyArgs) {
    return this.prismaService.notification.deleteMany(deleteManyDto);
  }
}
