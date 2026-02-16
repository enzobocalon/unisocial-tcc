import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConnectionProvider } from 'src/common/providers/connection.provider';
import { FriendshipsModule } from '../friendships/friendships.module';
import { UploadModule } from '../upload/upload.module';
import { CoursesModule } from '../courses/courses.module';
@Module({
  imports: [FriendshipsModule, UploadModule, CoursesModule],
  providers: [UsersResolver, UsersService, ConnectionProvider],
  exports: [UsersService],
})
export class UsersModule {}
