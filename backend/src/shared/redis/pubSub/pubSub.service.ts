import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { env } from 'src/config/env';

@Injectable()
export class RedisPubSubService extends RedisPubSub implements OnModuleInit {
  constructor() {
    super({
      connection: {
        host: env.redisHost,
        port: env.redisPort,
        password: env.redisPassword,
        username: env.redisUsername,
        db: env.redisDB,
      },
    });
  }

  async onModuleInit() {
    console.log('Starting redis');
  }
}
