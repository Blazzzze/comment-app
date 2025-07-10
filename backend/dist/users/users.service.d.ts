import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    create(data: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}
