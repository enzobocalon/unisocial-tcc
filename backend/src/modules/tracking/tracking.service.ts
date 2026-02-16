import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/shared/redis/redis.service';
import { RedisPubSubService } from 'src/shared/redis/pubSub/pubSub.service';
import { TrackingDataDto } from './dto/tracking-data.dto';
import { UsersService } from '../users/users.service';
import { BaseUser } from '../users/entities/baseUser.entity';
import { TrackingRepository } from 'src/shared/database/repositories/tracking.repositories';

@Injectable()
export class TrackingService implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private readonly pubSub: RedisPubSubService,
    private readonly usersService: UsersService,
    private readonly trackingRepo: TrackingRepository,
  ) {}

  async onModuleInit() {
    const subscriber = await this.redisService.getSubscriber();
    subscriber.subscribe('__keyevent@0__:expired');
    subscriber.on('message', async (channel, message) => {
      if (message.startsWith('tracking:cache:')) {
        const userId = message.split(':')[2];
        const user = await this.usersService.getUser(userId, true, false);
        await this.invalidateTracking(userId, user);
      }
    });
  }

  async sendTrackingData(userId: string, data: TrackingDataDto) {
    const { latitude, longitude } = data;

    if (!this.validateCoords(data)) {
      return this.invalidateTracking(userId, null);
    }
    const location = await this.getCampusLocation({ latitude, longitude });
    const user = await this.usersService.getUser(userId, true, false);

    if (!location.length) {
      return this.invalidateTracking(userId, user);
    }

    await this.redisService
      .pipeline()
      .srem('invalid:tracking', userId)
      .sadd('users:tracking', userId)
      .setex(
        `tracking:cache:${userId}`,
        60,
        JSON.stringify({ latitude, longitude, ...user }),
      )
      .exec();

    const onlineUsers = await this.getOnlineFriends(userId);
    const payload = {
      tracking: {
        latitude,
        longitude,
        building: location[1]?.name || null,
        ...user,
      },
    };

    await Promise.all(
      onlineUsers.map((id) => this.pubSub.publish(`locations:${id}`, payload)),
    );
    return payload.tracking;
  }

  async invalidateTracking(userId: string, user: BaseUser) {
    const [onlineUsers] = await Promise.all([this.getOnlineFriends(userId)]);
    if (!user) {
      user = await this.usersService.getUser(userId, true, false);
    }

    const payload = { tracking: { latitude: -999, longitude: -999, ...user } };
    await Promise.all([
      ...onlineUsers.map((id) =>
        this.pubSub.publish(`locations:${id}`, payload),
      ),
      await this.redisService
        .pipeline()
        .sadd('invalid:tracking', userId)
        .srem('users:tracking', userId)
        .exec(),
    ]);
    return payload.tracking;
  }

  async getTrackingData(userId: string) {
    const onlineUsers = await this.getOnlineFriends(userId);
    const data = await Promise.all(
      onlineUsers.map((id) => this.redisService.get(`tracking:cache:${id}`)),
    );
    return data.filter(Boolean).map((item) => JSON.parse(item));
  }

  tracking(userId: string) {
    return this.pubSub.asyncIterator(`locations:${userId}`);
  }

  private async getCampusLocation({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) {
    return this.trackingRepo.getBuilding({ latitude, longitude });
  }

  private validateCoords({ latitude, longitude }: TrackingDataDto) {
    return (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  private async getOnlineFriends(userId: string) {
    return this.redisService.sinter(
      'users:online',
      'users:tracking',
      `friends:${userId}`,
    );
  }
}
