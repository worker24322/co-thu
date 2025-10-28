import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type RoomStatus = 'waiting' | 'playing' | 'finished';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  hostUserId: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  guestUserId: string | null;

  @Column({ type: 'varchar', length: 20, default: 'waiting' })
  status: RoomStatus;

  @Column({ type: 'text', nullable: true })
  gameStateJson: string | null;
}


