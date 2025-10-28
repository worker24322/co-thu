import { Server, Socket } from 'socket.io';
export declare class RoomsGateway {
    server: Server;
    handleJoin(data: {
        roomId: string;
        userId: string;
    }, client: Socket): void;
    handleMove(data: {
        roomId: string;
        move: any;
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
