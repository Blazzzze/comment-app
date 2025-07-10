import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: TreeRepository<Comment>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.repo.findTrees();
  }

  async create(dto: CreateCommentDto, user: User): Promise<Comment> {
    const comment = this.repo.create({ content: dto.content, author: user });
    if (dto.parentId) {
      const parent = await this.repo.findOne({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Parent comment not found');
      comment.parent = parent;
    }
    return this.repo.save(comment);
  }

  async update(
    id: string,
    dto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.repo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    const fifteenMin = 1000 * 60 * 15;
    if (Date.now() - comment.createdAt.getTime() > fifteenMin) {
      throw new BadRequestException('Edit window expired');
    }

    comment.content = dto.content;

    if (dto.parentId) {
      const parent = await this.repo.findOne({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Parent comment not found');
      comment.parent = parent;
    }

    return this.repo.save(comment);
  }

  async softDelete(id: string, user: User): Promise<Comment> {
    const comment = await this.repo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('Comment not found');

    // now comment.author is guaranteed non-null
    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // rest unchanged…
    comment.deletedAt    = new Date();
    comment.deletedUntil = new Date(Date.now() + 15 * 60 * 1000);
    return this.repo.save(comment);
  }


  async restore(id: string, user: User): Promise<Comment> {
    const comment = await this.repo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    
    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only restore your own comments');
    }

    if (!comment.deletedUntil || comment.deletedUntil < new Date()) {
      throw new BadRequestException('Restore period has expired');
    }

    comment.deletedAt = null;
    comment.deletedUntil = null;

    return this.repo.save(comment);
  }


  @Cron(CronExpression.EVERY_10_MINUTES)
  async purgeExpired() {
    const expired = await this.repo.find({
      where: { deletedUntil: LessThan(new Date()) },
    });
    await this.repo.remove(expired);
    console.log(`Purged ${expired.length} comments`);
  }
}
