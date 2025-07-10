import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
export declare class Notification {
    id: string;
    user: User;
    comment: Comment;
    isRead: boolean;
    createdAt: Date;
}
