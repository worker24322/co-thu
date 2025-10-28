export type Player = 'A' | 'B';
export type PieceType = 'rat' | 'cat' | 'dog' | 'wolf' | 'leopard' | 'tiger' | 'lion' | 'elephant';
export interface Piece {
    owner: Player;
    type: PieceType;
}
export interface Coord {
    x: number;
    y: number;
}
export interface GameState {
    board: (Piece | null)[][];
    turn: Player;
}
