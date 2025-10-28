import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';

class CreateRoomDto {
  userId: string;
}

class JoinRoomDto {
  roomId: string;
  userId: string;
}

class FinishDto {
  roomId: string;
  winnerUserId: string;
}

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  list() {
    return this.roomsService.list();
  }

  @Post('create')
  create(@Body() body: CreateRoomDto) {
    return this.roomsService.create(body.userId);
  }

  @Post('join')
  join(@Body() body: JoinRoomDto) {
    return this.roomsService.join(body.roomId, body.userId);
  }

  @Post('finish')
  finish(@Body() body: FinishDto) {
    return this.roomsService.finish(body.roomId, body.winnerUserId);
  }
}


