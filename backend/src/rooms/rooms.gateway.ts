import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class RoomsGateway {
  @WebSocketServer()
  server: Server;

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
    @MessageBody() data: { roomId: string; move: any },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast to room EXCLUDING sender
    client.to(data.roomId).emit('move', data.move);
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


