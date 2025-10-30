import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class RoomsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomsService: RoomsService) {}

  @SubscribeMessage('join-room')
  handleJoin(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    this.server.to(data.roomId).emit('player-joined', data.userId);
  }

  @SubscribeMessage('move')
  handleMove(
    @MessageBody() data: { roomId: string; move: any; userId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Validate participant
    if (!data?.roomId) return;
    const roomId = data.roomId;
    const userId = data.userId;
    if (!userId) return; // ignore if unknown user
    this.roomsService
      .list()
      .then((rooms) => {
        const room = rooms.find((r) => (r as any).id === roomId);
        if (!room) return;
        const isMember = (room as any).hostUserId === userId || (room as any).guestUserId === userId;
        if (!isMember) return;
        // Broadcast to room EXCLUDING sender
        client.to(roomId).emit('move', data.move);
      })
      .catch(() => {});
  }

  @SubscribeMessage('sync-state')
  handleSyncState(
    @MessageBody() data: { roomId: string; state: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit('sync-state', data.state);
  }

  @SubscribeMessage('game-over')
  handleGameOver(
    @MessageBody() data: { roomId: string; winner: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit('game-over', { winner: data.winner });
  }
}


