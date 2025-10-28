import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { RoomEntity } from './room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';
@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity]), UsersModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway],
  exports: [RoomsService],
})
export class RoomsModule {}


