"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const RIVER_TILES = new Set([
    ...coordsRect(1, 3, 2, 5),
    ...coordsRect(4, 3, 5, 5),
].map(keyOfCoord));
const DENS = {
    A: keyOfCoord({ x: 3, y: 8 }),
    B: keyOfCoord({ x: 3, y: 0 }),
};
const TRAPS = new Set([
    keyOfCoord({ x: 2, y: 8 }),
    keyOfCoord({ x: 4, y: 8 }),
    keyOfCoord({ x: 3, y: 7 }),
    keyOfCoord({ x: 2, y: 0 }),
    keyOfCoord({ x: 4, y: 0 }),
    keyOfCoord({ x: 3, y: 1 }),
]);
const RANK = {
    rat: 1,
    cat: 2,
    dog: 3,
    wolf: 4,
    leopard: 5,
    tiger: 6,
    lion: 7,
    elephant: 8,
};
function keyOfCoord(c) {
    return `${c.x},${c.y}`;
}
function coordsRect(x1, y1, x2, y2) {
    const res = [];
    for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++)
            res.push({ x, y });
    }
    return res;
}
let GameService = class GameService {
    initialize() {
        const board = Array.from({ length: 7 }, () => Array.from({ length: 9 }, () => null));
        const place = (x, y, owner, type) => (board[x][y] = { owner, type });
        place(0, 0, 'B', 'lion');
        place(6, 0, 'B', 'lion');
        place(0, 1, 'B', 'dog');
        place(4, 1, 'B', 'cat');
        place(6, 1, 'B', 'elephant');
        place(0, 2, 'B', 'rat');
        place(2, 2, 'B', 'leopard');
        place(4, 2, 'B', 'wolf');
        place(6, 2, 'B', 'elephant');
        place(0, 6, 'A', 'elephant');
        place(2, 6, 'A', 'wolf');
        place(4, 6, 'A', 'leopard');
        place(6, 6, 'A', 'rat');
        place(1, 7, 'A', 'cat');
        place(5, 7, 'A', 'dog');
        place(0, 8, 'A', 'tiger');
        place(2, 8, 'A', 'lion');
        place(4, 8, 'A', 'lion');
        place(6, 8, 'A', 'lion');
        return { board, turn: 'A' };
    }
    isRiver(c) {
        return RIVER_TILES.has(keyOfCoord(c));
    }
    isTrap(c) {
        return TRAPS.has(keyOfCoord(c));
    }
    isDen(c) {
        return keyOfCoord(c) === DENS.A || keyOfCoord(c) === DENS.B;
    }
    validateAndApplyMove(state, from, to) {
        const { board, turn } = state;
        const piece = board[from.x][from.y];
        if (!piece || piece.owner !== turn)
            return null;
        if ((turn === 'A' && keyOfCoord(to) === DENS.A) || (turn === 'B' && keyOfCoord(to) === DENS.B))
            return null;
        if (!this.isLegalMove(board, from, to))
            return null;
        const target = board[to.x][to.y];
        if (target) {
            if (target.owner === piece.owner)
                return null;
            if (!this.canCapture(board, piece, from, target, to))
                return null;
        }
        board[to.x][to.y] = piece;
        board[from.x][from.y] = null;
        return { board, turn: turn === 'A' ? 'B' : 'A' };
    }
    isAdjacent(a, b) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        return dx + dy === 1;
    }
    isLegalMove(board, from, to) {
        const piece = board[from.x][from.y];
        const oneStep = this.isAdjacent(from, to);
        const fromRiver = this.isRiver(from);
        const toRiver = this.isRiver(to);
        if (piece.type !== 'rat' && (fromRiver || toRiver))
            return false;
        if (!oneStep && (piece.type === 'lion' || piece.type === 'tiger')) {
            if (from.x === to.x || from.y === to.y) {
                if (this.isStraightRiverJumpClear(board, from, to))
                    return true;
            }
            return false;
        }
        if (!oneStep)
            return false;
        return true;
    }
    isStraightRiverJumpClear(board, from, to) {
        if (!(from.x === to.x || from.y === to.y))
            return false;
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
                if (p && p.type === 'rat')
                    return false;
            }
            x += dx;
            y += dy;
        }
        return hasRiver;
    }
    canCapture(board, attacker, from, defender, to) {
        if (attacker.type === 'rat') {
            const attackerInWater = this.isRiver(from);
            const defenderInWater = this.isRiver(to);
            if (attackerInWater && !defenderInWater)
                return false;
            if (defender.type === 'elephant')
                return true;
        }
        if (defender.type === 'rat') {
            if (attacker.type === 'elephant')
                return false;
            const attackerInWater = this.isRiver(from);
            const defenderInWater = this.isRiver(to);
            if (defenderInWater && !(attacker.type === 'rat' && attackerInWater))
                return false;
        }
        const toKey = keyOfCoord(to);
        const defenderIsTrapped = TRAPS.has(toKey);
        if (defenderIsTrapped)
            return true;
        return RANK[attacker.type] >= RANK[defender.type];
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
//# sourceMappingURL=game.service.js.map