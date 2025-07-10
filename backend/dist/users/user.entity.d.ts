import { Comment } from '../comments/comment.entity';
import { Notification } from '../notifications/notification.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    comments: Comment[];
    notifications: Notification[];
}
