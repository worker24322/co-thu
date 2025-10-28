export type RoomStatus = 'waiting' | 'playing' | 'finished';
export declare class RoomEntity {
    id: string;
    hostUserId: string;
    guestUserId: string | null;
    status: RoomStatus;
    gameStateJson: string | null;
}
