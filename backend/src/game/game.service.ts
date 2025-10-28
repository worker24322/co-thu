import { Injectable } from '@nestjs/common';
import { Coord, GameState, Piece, PieceType, Player } from './game.types';

const RIVER_TILES = new Set(
  [
    // left river (x:1..2, y:3..5)
    ...coordsRect(1, 3, 2, 5),
    // right river (x:4..5, y:3..5)
    ...coordsRect(4, 3, 5, 5),
  ].map(keyOfCoord),
);

const DENS: Record<Player, string> = {
  A: keyOfCoord({ x: 3, y: 8 }),
  B: keyOfCoord({ x: 3, y: 0 }),
};

const TRAPS = new Set(
  [
    // Around A den (y=8)
    keyOfCoord({ x: 2, y: 8 }),
    keyOfCoord({ x: 4, y: 8 }),
    keyOfCoord({ x: 3, y: 7 }),
    // Around B den (y=0)
    keyOfCoord({ x: 2, y: 0 }),
    keyOfCoord({ x: 4, y: 0 }),
    keyOfCoord({ x: 3, y: 1 }),
  ],
);

const RANK: Record<PieceType, number> = {
  rat: 1,
  cat: 2,
  dog: 3,
  wolf: 4,
  leopard: 5,
  tiger: 6,
  lion: 7,
  elephant: 8,
};

function keyOfCoord(c: Coord): string {
  return `${c.x},${c.y}`;
}

function coordsRect(x1: number, y1: number, x2: number, y2: number): Coord[] {
  const res: Coord[] = [];
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) res.push({ x, y });
  }
  return res;
}

@Injectable()
export class GameService {
  initialize(): GameState {
    const board: (Piece | null)[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: 9 }, () => null),
    );
    // Setup pieces per standard arrangement (top is B, bottom is A)
    const place = (x: number, y: number, owner: Player, type: PieceType) =>
      (board[x][y] = { owner, type });

    // B side (top) - Row 0
    place(0, 0, 'B', 'lion');      // (0,0)
    place(6, 0, 'B', 'lion');      // (6,0)
    // Row 1
    place(0, 1, 'B', 'dog');       // (0,1)
    place(4, 1, 'B', 'cat');       // (4,1)
    place(6, 1, 'B', 'elephant');  // (6,1)
    // Row 2
    place(0, 2, 'B', 'rat');       // (0,2)
    place(2, 2, 'B', 'leopard');   // (2,2)
    place(4, 2, 'B', 'wolf');      // (4,2)
    place(6, 2, 'B', 'elephant');  // (6,2)

    // A side (bottom) - Row 6
    place(0, 6, 'A', 'elephant');  // (0,6)
    place(2, 6, 'A', 'wolf');      // (2,6)
    place(4, 6, 'A', 'leopard');   // (4,6)
    place(6, 6, 'A', 'rat');       // (6,6)
    // Row 7
    place(1, 7, 'A', 'cat');       // (1,7)
    place(5, 7, 'A', 'dog');       // (5,7)
    // Row 8
    place(0, 8, 'A', 'tiger');     // (0,8)
    place(2, 8, 'A', 'lion');      // (2,8)
    place(4, 8, 'A', 'lion');      // (4,8)
    place(6, 8, 'A', 'lion');      // (6,8)

    return { board, turn: 'A' };
  }

  isRiver(c: Coord): boolean {
    return RIVER_TILES.has(keyOfCoord(c));
  }

  isTrap(c: Coord): boolean {
    return TRAPS.has(keyOfCoord(c));
  }

  isDen(c: Coord): boolean {
    return keyOfCoord(c) === DENS.A || keyOfCoord(c) === DENS.B;
  }

  validateAndApplyMove(state: GameState, from: Coord, to: Coord): GameState | null {
    const { board, turn } = state;
    const piece = board[from.x][from.y];
    if (!piece || piece.owner !== turn) return null;
    // Cannot enter own den
    if ((turn === 'A' && keyOfCoord(to) === DENS.A) || (turn === 'B' && keyOfCoord(to) === DENS.B))
      return null;

    // Compute legal destination
    if (!this.isLegalMove(board, from, to)) return null;

    const target = board[to.x][to.y];
    // Capture rules
    if (target) {
      if (target.owner === piece.owner) return null;
      if (!this.canCapture(board, piece, from, target, to)) return null;
    }

    // Apply move
    board[to.x][to.y] = piece;
    board[from.x][from.y] = null;

    return { board, turn: turn === 'A' ? 'B' : 'A' };
  }

  private isAdjacent(a: Coord, b: Coord): boolean {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return dx + dy === 1;
  }

  private isLegalMove(board: (Piece | null)[][], from: Coord, to: Coord): boolean {
    const piece = board[from.x][from.y]!;
    // Basic one-step orthogonal move
    const oneStep = this.isAdjacent(from, to);

    const fromRiver = this.isRiver(from);
    const toRiver = this.isRiver(to);

    if (piece.type !== 'rat' && (fromRiver || toRiver)) return false; // only rat enters river

    // Lion/Tiger river jump
    if (!oneStep && (piece.type === 'lion' || piece.type === 'tiger')) {
      if (from.x === to.x || from.y === to.y) {
        if (this.isStraightRiverJumpClear(board, from, to)) return true;
      }
      return false;
    }

    // Others must move one step and cannot end in river (except rat handled above)
    if (!oneStep) return false;
    return true;
  }

  private isStraightRiverJumpClear(board: (Piece | null)[][], from: Coord, to: Coord): boolean {
    // Must be straight line fully over river, and no rat in river along path
    if (!(from.x === to.x || from.y === to.y)) return false;
    const dx = Math.sign(to.x - from.x);
    const dy = Math.sign(to.y - from.y);
    let x = from.x + dx;
    let y = from.y + dy;
    let hasRiver = false;
    while (x !== to.x || y !== to.y) {
      const c = { x, y };
      if (this.isRiver(c)) {
        hasRiver = true;
        const p = board[x][y];
        if (p && p.type === 'rat') return false; // rat blocks jump
      }
      x += dx;
      y += dy;
    }
    return hasRiver; // must jump over river
  }

  private canCapture(
    board: (Piece | null)[][],
    attacker: Piece,
    from: Coord,
    defender: Piece,
    to: Coord,
  ): boolean {
    // Rat special rules
    if (attacker.type === 'rat') {
      const attackerInWater = this.isRiver(from);
      const defenderInWater = this.isRiver(to);
      // Rat in water cannot capture a piece on land (except another rat in adjacent water)
      if (attackerInWater && !defenderInWater) return false;
      // Rat can capture elephant
      if (defender.type === 'elephant') return true;
    }

    if (defender.type === 'rat') {
      // Elephant cannot capture rat
      if (attacker.type === 'elephant') return false;
      // Rat in water can only be captured by rat also in water
      const attackerInWater = this.isRiver(from);
      const defenderInWater = this.isRiver(to);
      if (defenderInWater && !(attacker.type === 'rat' && attackerInWater)) return false;
    }

    // Trap: defender in opponent trap is rank 0 and can be captured by any
    const toKey = keyOfCoord(to);
    const defenderIsTrapped = TRAPS.has(toKey);
    if (defenderIsTrapped) return true;

    // Rank comparison
    return RANK[attacker.type] >= RANK[defender.type];
  }
}


