import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1️⃣ Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // 2️⃣ Async TypeORM config using ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,     // ✅ only for dev; disable in prod
        logging: true,         // optional, useful for debugging
      }),
    }),

    UsersModule,

    CommentsModule,

    NotificationsModule,

    AuthModule,
    // … later: your feature modules (UsersModule, CommentsModule, NotificationsModule)

  ],
})
export class AppModule {}
