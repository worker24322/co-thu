import { AuthService } from './auth.service';
declare class RegisterDto {
    email: string;
    password: string;
}
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            score: number;
        };
        token: string;
    }>;
    login(body: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            score: number;
        };
        token: string;
    }>;
}
export {};
