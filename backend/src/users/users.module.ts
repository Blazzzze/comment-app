// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService }    from './users.service';
import { UsersController } from './users.controller';  // if you scaffolded a controller
import { User }            from './user.entity';

@Module({
  imports: [
    // ← Register the User entity here
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    UsersService,
  ],
  exports: [
    UsersService,           // ← so AuthModule and CommentsModule can use it
  ],
  controllers: [
    UsersController,        // ← optional
  ],
})
export class UsersModule {}
