import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(
    @InjectRedis('default') private readonly redis: Redis,
    @InjectRedis('subscriber') private readonly subscriber: Redis,
  ) {}

  async onModuleInit() {
    console.log('Starting Redis Service...');
  }

  async sadd(key: string, field: string[]) {
    return this.redis.sadd(key, field);
  }

  pipeline() {
    return this.redis.pipeline();
  }

  async srem(key: string, field: string) {
    return this.redis.srem(key, field);
  }

  async smembers(key: string) {
    return this.redis.smembers(key);
  }

  async sismember(key: string, field: string) {
    return this.redis.sismember(key, field);
  }

  async setex(key: string, value: string, duration?: number) {
    return this.redis.setex(key, duration, value);
  }

  async sinter(...keySets: string[]) {
    return this.redis.sinter(keySets);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async del(key: string) {
    return this.redis.del(key);
  }

  async exists(key: string) {
    const exists = await this.redis.exists(key);
    return exists === 1;
  }

  async getSubscriber() {
    return this.subscriber;
  }
}
