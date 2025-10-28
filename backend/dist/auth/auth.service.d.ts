import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            score: number;
        };
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            score: number;
        };
        token: string;
    }>;
    private createToken;
}
