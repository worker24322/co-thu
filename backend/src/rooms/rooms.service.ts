import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './room.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomsRepo: Repository<RoomEntity>,
    private readonly usersService: UsersService,
  ) {}

  async list(): Promise<RoomEntity[]> {
    return await this.roomsRepo.find();
  }

  async create(hostUserId: string): Promise<RoomEntity> {
    const room = this.roomsRepo.create({ hostUserId, status: 'waiting' });
    return await this.roomsRepo.save(room);
  }

  async join(roomId: string, guestUserId: string): Promise<RoomEntity> {
    const room = await this.roomsRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    room.guestUserId = guestUserId;
    room.status = 'playing';
    return await this.roomsRepo.save(room);
  }

  async finish(roomId: string, winnerUserId: string): Promise<RoomEntity> {
    const room = await this.roomsRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    room.status = 'finished';
    await this.usersService.incrementScore(winnerUserId, 1);
    return await this.roomsRepo.save(room);
  }
}


