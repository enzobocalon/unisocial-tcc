import { Module } from '@nestjs/common';
import { AssignmentsService } from './services/assignments.service';
import { AssignmentsResolver } from './resolvers/assignments.resolver';
import { FriendshipsModule } from '../friendships/friendships.module';
import { UploadModule } from '../upload/upload.module';
import { UsersModule } from '../users/users.module';
import { AssignmentsTasksResolver } from './resolvers/assignments-tasks.resolver';
import { AssignmentsTasksService } from './services/assignments-tasks.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    FriendshipsModule,
    UploadModule,
    UsersModule,
    UsersModule,
    NotificationsModule,
  ],
  providers: [
    AssignmentsResolver,
    AssignmentsTasksResolver,
    AssignmentsService,
    AssignmentsTasksService,
  ],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
