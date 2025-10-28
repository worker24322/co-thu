import { RoomsService } from './rooms.service';
declare class CreateRoomDto {
    userId: string;
}
declare class JoinRoomDto {
    roomId: string;
    userId: string;
}
declare class FinishDto {
    roomId: string;
    winnerUserId: string;
}
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    list(): Promise<import("./room.entity").RoomEntity[]>;
    create(body: CreateRoomDto): Promise<import("./room.entity").RoomEntity>;
    join(body: JoinRoomDto): Promise<import("./room.entity").RoomEntity>;
    finish(body: FinishDto): Promise<import("./room.entity").RoomEntity>;
}
export {};
