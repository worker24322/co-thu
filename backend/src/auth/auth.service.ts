import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, passwordHash);
    const token = await this.createToken(user.id, user.email);
    return { user: { id: user.id, email: user.email, score: user.score }, token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.createToken(user.id, user.email);
    return { user: { id: user.id, email: user.email, score: user.score }, token };
  }

  private async createToken(userId: string, email: string) {
    return await this.jwtService.signAsync({ sub: userId, email });
  }
}


