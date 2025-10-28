import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.usersRepo.findOne({ where: { email } });
  }

  async create(email: string, passwordHash: string): Promise<UserEntity> {
    const user = this.usersRepo.create({ email, passwordHash });
    return await this.usersRepo.save(user);
  }

  async incrementScore(userId: string, delta = 1): Promise<void> {
    await this.usersRepo.increment({ id: userId }, 'score', delta);
  }
}

