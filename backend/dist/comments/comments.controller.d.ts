import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findAll(): Promise<import("./comment.entity").Comment[]>;
    create(dto: CreateCommentDto, req: any): Promise<import("./comment.entity").Comment>;
    update(id: string, dto: UpdateCommentDto, req: any): Promise<import("./comment.entity").Comment>;
    softDelete(id: string, req: any): Promise<import("./comment.entity").Comment>;
    restore(id: string, req: any): Promise<import("./comment.entity").Comment>;
}
