import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './shared/database/database.module';
import { CoursesModule } from './modules/courses/courses.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UploadModule } from './modules/upload/upload.module';
import { LikesModule } from './modules/likes/likes.module';
import { FriendshipsModule } from './modules/friendships/friendships.module';
import { SharesModule } from './modules/shares/shares.module';
import { RepliesModule } from './modules/replies/replies.module';
import { UtilsModule } from './shared/utils/utils.module';
import { MentionsModule } from './modules/mentions/mentions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RedisPubSubModule } from './shared/redis/pubSub/pubSub.module';
import { RedisModule as RedisModuleConfig } from '@liaoliaots/nestjs-redis';
import { env } from './config/env';
import { RedisModule } from './shared/redis/redis.module';
import { SubscriptionConnection } from './common/providers/connection.provider';
import { TrackingModule } from './modules/tracking/tracking.module';
import { EmailsModule } from './modules/emails/emails.module';
import { ChatsModule } from './modules/chats/chats.module';
import { UploadMiddleware } from './modules/upload/upload.middleware';
import { SearchModule } from './modules/search/search.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': {
          path: '/subs',
          onConnect: (ctx: SubscriptionConnection) => {
            const { connectionParams, extra } = ctx;
            extra.authorization = connectionParams.Authorization;
            extra.isStatus = connectionParams.isStatus;
            extra.isTracking = connectionParams.isTracking;
          },
        },
      },
      formatError: (err) => ({
        message: err.message,
        code: err.extensions?.code || 'SERVER_ERROR',
        path: err.path,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'uploads'),
      serveStaticOptions: {
        index: false,
      },
      serveRoot: '/public/uploads',
    }),
    RedisModuleConfig.forRoot({
      config: [
        {
          namespace: 'default',
          host: env.redisHost,
          port: env.redisPort,
        },
        {
          namespace: 'subscriber',
          host: env.redisHost,
          port: env.redisPort,
        },
      ],
    }),
    DatabaseModule,
    NotificationsModule,
    UsersModule,
    AuthModule,
    CoursesModule,
    PostsModule,
    UploadModule,
    FriendshipsModule,
    LikesModule,
    SharesModule,
    RepliesModule,
    UtilsModule,
    MentionsModule,
    RedisPubSubModule,
    RedisModule,
    TrackingModule,
    EmailsModule,
    ChatsModule,
    SearchModule,
    AssignmentsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UploadMiddleware).forRoutes({
      path: 'public/uploads/*',
      method: RequestMethod.GET,
    });
  }
}
