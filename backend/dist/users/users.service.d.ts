import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: Repository<UserEntity>);
    findByEmail(email: string): Promise<UserEntity | null>;
    create(email: string, passwordHash: string): Promise<UserEntity>;
    incrementScore(userId: string, delta?: number): Promise<void>;
}
