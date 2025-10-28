import { Repository } from 'typeorm';
import { RoomEntity } from './room.entity';
import { UsersService } from '../users/users.service';
export declare class RoomsService {
    private readonly roomsRepo;
    private readonly usersService;
    constructor(roomsRepo: Repository<RoomEntity>, usersService: UsersService);
    list(): Promise<RoomEntity[]>;
    create(hostUserId: string): Promise<RoomEntity>;
    join(roomId: string, guestUserId: string): Promise<RoomEntity>;
    finish(roomId: string, winnerUserId: string): Promise<RoomEntity>;
}
