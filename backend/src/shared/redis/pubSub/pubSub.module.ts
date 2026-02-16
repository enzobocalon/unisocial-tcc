import { Global, Module } from '@nestjs/common';
import { RedisPubSubService } from './pubSub.service';

@Global()
@Module({
  providers: [RedisPubSubService],
  exports: [RedisPubSubService],
})
export class RedisPubSubModule {}
