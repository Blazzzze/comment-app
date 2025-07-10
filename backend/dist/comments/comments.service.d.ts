import { TreeRepository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/user.entity';
export declare class CommentsService {
    private readonly repo;
    constructor(repo: TreeRepository<Comment>);
    findAll(): Promise<Comment[]>;
    create(dto: CreateCommentDto, user: User): Promise<Comment>;
    update(id: string, dto: UpdateCommentDto, user: User): Promise<Comment>;
    softDelete(id: string, user: User): Promise<Comment>;
    restore(id: string, user: User): Promise<Comment>;
    purgeExpired(): Promise<void>;
}
