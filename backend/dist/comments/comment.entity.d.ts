import { User } from '../users/user.entity';
export declare class Comment {
    id: string;
    author: User;
    replies: Comment[];
    parent: Comment;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    deletedUntil: Date | null;
}
