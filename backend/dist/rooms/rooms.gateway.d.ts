import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';
export declare class RoomsGateway {
    private readonly roomsService;
    server: Server;
    constructor(roomsService: RoomsService);
    handleJoin(data: {
        roomId: string;
        userId: string;
    }, client: Socket): void;
    handleMove(data: {
        roomId: string;
        move: any;
        userId?: string;
    }, client: Socket): void;
    handleSyncState(data: {
        roomId: string;
        state: any;
    }, client: Socket): void;
    handleGameOver(data: {
        roomId: string;
        winner: string;
    }, client: Socket): void;
}
