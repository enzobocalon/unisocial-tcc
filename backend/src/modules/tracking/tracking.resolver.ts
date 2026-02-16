import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { TrackingService } from './tracking.service';
import { Tracking } from './entities/tracking.entity';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { TrackingDataDto } from './dto/tracking-data.dto';

@Resolver()
export class TrackingResolver {
  constructor(private readonly trackingService: TrackingService) {}

  @Query(() => [Tracking])
  getTrackingData(@ActiveUserId() userId: string) {
    return this.trackingService.getTrackingData(userId);
  }

  // @IsPublic()
  // @Query(() => [Tracking])
  // generateTrackingData() {
  //   return this.trackingService.generateTrackingData();
  // }

  @Mutation(() => Tracking)
  invalidateTracking(@ActiveUserId() userId: string) {
    return this.trackingService.invalidateTracking(userId, null);
  }

  @Mutation(() => Tracking)
  async sendTrackingData(
    @ActiveUserId() userId: string,
    @Args('data') data: TrackingDataDto,
  ) {
    return this.trackingService.sendTrackingData(userId, data);
  }

  @Subscription(() => Tracking)
  async tracking(@ActiveUserId() userId: string) {
    return this.trackingService.tracking(userId);
  }
}
