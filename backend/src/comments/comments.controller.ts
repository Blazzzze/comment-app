// import { Controller, Get, Post, Body, Param, Req, UseGuards, Put } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { CommentsService } from './comments.service';
// import { CreateCommentDto } from './dto/create-comment.dto';
// import { UpdateCommentDto } from './dto/update-comment.dto';

// @Controller('comments')
// @UseGuards(AuthGuard('jwt'))
// export class CommentsController {
//   constructor(private readonly commentsService: CommentsService) {}

//   @Get()
//   async findAll() {
//     return this.commentsService.findAll();
//   }

//   @Post()
//   async create(@Body() dto: CreateCommentDto, @Req() req) {
//     // req.user is set by JwtStrategy.validate()
//     return this.commentsService.create(dto, req.user);
//   }

//   @Put(':id')
//   async update(@Param('id') id: string, @Body() dto: UpdateCommentDto, @Req() req) {
//     return this.commentsService.update(id, dto, req.user);
//   }
// }
// backend/src/comments/comments.controller.ts

import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Req, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCommentDto, @Req() req) {
    return this.commentsService.create(dto, req.user);
  }

  // ← Make sure this method is here verbatim:
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @Req() req,
  ) {
    return this.commentsService.update(id, dto, req.user);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string, @Req() req) {
    return this.commentsService.softDelete(id, req.user);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string, @Req() req) {
    return this.commentsService.restore(id, req.user);
  }
}
