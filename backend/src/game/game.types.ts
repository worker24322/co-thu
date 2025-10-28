export type Player = 'A' | 'B';

export type PieceType =
  | 'rat' // 1
  | 'cat' // 2
  | 'dog' // 3
  | 'wolf' // 4
  | 'leopard' // 5
  | 'tiger' // 6
  | 'lion' // 7
  | 'elephant'; // 8

export interface Piece {
  owner: Player;
  type: PieceType;
}

export interface Coord {
  x: number; // 0..6
  y: number; // 0..8
}

export interface GameState {
  board: (Piece | null)[][]; // [x][y]
  turn: Player;
}


