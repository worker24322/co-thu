import { Coord, GameState } from './game.types';
export declare class GameService {
    initialize(): GameState;
    isRiver(c: Coord): boolean;
    isTrap(c: Coord): boolean;
    isDen(c: Coord): boolean;
    validateAndApplyMove(state: GameState, from: Coord, to: Coord): GameState | null;
    private isAdjacent;
    private isLegalMove;
    private isStraightRiverJumpClear;
    private canCapture;
}
