import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import {
  ConnectionProvider,
  SubscriptionConnection,
} from 'src/common/providers/connection.provider';
import { UsersRepository } from 'src/shared/database/repositories/user.repositories';
import { RedisPubSubService } from 'src/shared/redis/pubSub/pubSub.service';
import { RedisService } from 'src/shared/redis/redis.service';
import { FriendshipsService } from '../friendships/friendships.service';
import {
  BASE_USER_SELECTOR,
  CACHE_EXPIRATION_SECONDS,
  PAGE_SIZE,
} from 'src/common/constants';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UploadService } from '../upload/upload.service';
import { compare, hash } from 'bcryptjs';
import { BaseUser } from './entities/baseUser.entity';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly redisService: RedisService,
    private readonly friendsService: FriendshipsService,
    private readonly pubSub: RedisPubSubService,
    private readonly connectionProvider: ConnectionProvider,
    private readonly uploadService: UploadService,
    private readonly courseService: CoursesService,
  ) {}

  async onModuleInit() {
    const subscriber = await this.redisService.getSubscriber();
    subscriber.subscribe('__keyevent@0__:expired');
    subscriber.on('message', async (channel, message) => {
      if (message.startsWith('heartbeat:')) {
        const userId = message.split(':')[1];
        console.log('Heartbeat expirou:', userId);
        await this.handleDisconnecting(userId);
      }
    });
  }

  async updateProfile(userId: string, data: UpdateProfileDTO) {
    const { avatar, name, banner, bio, courseId } = data;

    const user = await this.usersRepo.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (avatar) {
      this.uploadService.deleteFromDisk(user.avatar);
    }

    if (banner) {
      this.uploadService.deleteFromDisk(user.banner);
    }

    if (courseId) {
      const isValidCourse = await this.courseService.findById(courseId);
      if (!isValidCourse) {
        throw new BadRequestException('Curso inválido');
      }
    }

    const updatedUser = await this.usersRepo.update({
      where: {
        id: userId,
      },
      data: {
        avatar: avatar === 'DELETE' ? null : avatar || undefined,
        name: name || undefined,
        banner: banner === 'DELETE' ? null : banner || undefined,
        bio: bio || undefined,
        courseId: courseId || undefined,
      },
    });

    await this.redisService.setex(
      `users:cache:${userId}`,
      JSON.stringify(updatedUser),
      CACHE_EXPIRATION_SECONDS,
    );

    return updatedUser;
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    const { username, password, confirmPassword, currentPassword } = data;

    let updatedPassword: string | undefined = undefined;
    if (password && !currentPassword) {
      throw new BadRequestException('Senha atual é obrigatória');
    }

    const user = await this.usersRepo.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (currentPassword) {
      if (password !== confirmPassword) {
        throw new BadRequestException('Senhas não coincidem');
      }
      const passwordMatch = await compare(currentPassword, user.password);
      if (!passwordMatch) {
        throw new BadRequestException('Senha atual incorreta');
      }
      updatedPassword = await hash(password, 8);
    }

    await this.usersRepo.update({
      where: {
        id: userId,
      },
      data: {
        username: username || undefined,
        password: updatedPassword,
      },
      select: BASE_USER_SELECTOR,
    });

    await this.redisService.del(`users:cache:${userId}`);

    return await this.getUser(userId, false);
  }

  async getUser(id: string, useCache = true, shouldCountFriends = true) {
    try {
      if (!id) {
        throw new BadRequestException('ID inválido');
      }
      if (useCache) {
        const cachedUser = await this.redisService.get(`users:cache:${id}`);
        if (cachedUser) {
          return JSON.parse(cachedUser) as BaseUser;
        }
        const user: BaseUser = await this.getUser(id, false);
        await this.redisService.setex(
          `users:cache:${id}`,
          JSON.stringify(user),
          CACHE_EXPIRATION_SECONDS,
        );
        return user as BaseUser;
      }
      const user = (await this.usersRepo.findUnique({
        where: {
          id,
        },
        select: {
          ...BASE_USER_SELECTOR,
          bio: true,
          banner: true,
          courseId: true,
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })) as BaseUser;

      const friends = await this.friendsService.getUsersFriends(
        id,
        false,
        false,
      );

      await Promise.all([
        this.redisService.sadd('users:online', [id]),
        friends.length > 0
          ? this.redisService.sadd(`friends:${id}`, friends)
          : Promise.resolve(),
      ]);

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      if (shouldCountFriends) {
        const friendsCount = await this.friendsService.countFriends(id);
        user.friendsCount = friendsCount;
      }

      return user;
    } catch (e) {
      console.log(e);
    }
  }

  async getUsersById(ids: string[], page: number, userId: string) {
    const users: BaseUser[] = await this.usersRepo.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: BASE_USER_SELECTOR,
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    users.forEach((user) => {
      user.friendship = null;
    });

    return users;
  }

  async getUsersByUsername(username: string, page: number, userId: string) {
    try {
      const users = (await this.usersRepo.findMany({
        where: {
          username: {
            contains: username,
          },
          AND: {
            NOT: {
              id: {
                equals: userId,
              },
            },
          },
        },
        select: {
          ...BASE_USER_SELECTOR,
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      })) as BaseUser[];

      return users;
    } catch (e) {
      console.log(e);
    }
  }

  async isUserOnline(userId: string) {
    return (await this.redisService.sismember('users:online', userId)) === 1;
  }

  async getProfile(id: string, userId: string) {
    if (id === userId) {
      return await this.getUser(id, false);
    }
    const user = (await this.usersRepo.findUnique({
      where: {
        id,
      },
      select: {
        ...BASE_USER_SELECTOR,
        bio: true,
        banner: true,
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })) as BaseUser;

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const friendsCount = await this.friendsService.countFriends(id);
    const friendship = await this.friendsService.friendshipStatus(userId, id);
    user.friendsCount = friendsCount;
    user.friendship = friendship;
    return user;
  }

  async handleHeartbeat(userId: string) {
    const heartbetKey = `heartbeat:${userId}`;
    console.info(`O usuário ${userId} enviou o heartbeat para estar online.`);

    const isUserAlreadyOnline = await this.redisService.sismember(
      'users:online',
      userId,
    );

    await Promise.all([
      this.redisService.setex(heartbetKey, '1', 300),
      this.redisService.sadd('users:online', [userId]),
    ]);

    if (!isUserAlreadyOnline) {
      const user = await this.getUser(userId);
      await this.pubSub.publish(`status:${userId}`, {
        friendStatus: {
          ...user,
          online: true,
        },
      });
    }

    return { message: 'Sucesso', success: true };
  }

  // TODO: provavelmente vai poder remover.
  async userStatus(id: string, context: SubscriptionConnection) {
    try {
      // Manually handles disconnecting!
      if (!context) throw new InternalServerErrorException('Contexto inválido');
      if (!id) throw new NotFoundException('ID inválido');
      const isStatus = context.extra.isStatus;
      const isDisconnecting = context.extra.socket._closeFrameReceived;
      const isTracking = context.extra.isTracking;
      if (isTracking && isDisconnecting) {
        await Promise.all([this.redisService.srem('users:tracking', id)]);
      }
      if (!isStatus) return this.pubSub.asyncIterator(`own_status:${id}`);
      if (!isDisconnecting) {
        const ownUserInfo = await this.getUser(id);
        const friends = await this.friendsService.getUsersFriends(
          id,
          false,
          false,
        );
        await Promise.all([
          this.handleHeartbeat(id),
          this.redisService.sadd('users:online', [id]),
          this.redisService.sadd(`friends:${id}`, friends),
          this.pubSub.publish(`status:${id}`, {
            friendStatus: {
              ...ownUserInfo,
              online: true,
            },
          }),
        ]);
      } else {
        await this.handleDisconnecting(id);
      }
      return this.pubSub.asyncIterator(`own_status:${id}`);
    } catch (e) {
      console.log('erro em usersStatus', e);
    }
  }

  async handleDisconnecting(id: string) {
    console.log('chamou disconnecting');
    console.log('userId:', id);
    const ownUserInfo = await this.getUser(id);
    await Promise.all([
      this.redisService.srem('users:online', id),
      this.redisService.del(`friends:${id}`),
      this.redisService.srem('invalid:tracking', id),
      this.pubSub.publish(`status:${id}`, {
        friendStatus: {
          ...ownUserInfo,
          online: false,
        },
      }),
      this.redisService.srem('users:tracking', id),
      this.usersRepo.update({
        where: {
          id,
        },
        data: {
          lastSeen: new Date(),
        },
      }),
    ]);
  }
}
