import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingResolver } from './tracking.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [TrackingResolver, TrackingService],
})
export class TrackingModule {}
