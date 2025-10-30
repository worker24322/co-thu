"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const rooms_service_1 = require("./rooms.service");
let RoomsGateway = class RoomsGateway {
    roomsService;
    server;
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    handleJoin(data, client) {
        client.join(data.roomId);
        this.server.to(data.roomId).emit('player-joined', data.userId);
    }
    handleMove(data, client) {
        if (!data?.roomId)
            return;
        const roomId = data.roomId;
        const userId = data.userId;
        if (!userId)
            return;
        this.roomsService
            .list()
            .then((rooms) => {
            const room = rooms.find((r) => r.id === roomId);
            if (!room)
                return;
            const isMember = room.hostUserId === userId || room.guestUserId === userId;
            if (!isMember)
                return;
            client.to(roomId).emit('move', data.move);
        })
            .catch(() => { });
    }
    handleSyncState(data, client) {
        client.to(data.roomId).emit('sync-state', data.state);
    }
    handleGameOver(data, client) {
        client.to(data.roomId).emit('game-over', { winner: data.winner });
    }
};
exports.RoomsGateway = RoomsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RoomsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('move'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sync-state'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleSyncState", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('game-over'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleGameOver", null);
exports.RoomsGateway = RoomsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: true, credentials: true } }),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsGateway);
//# sourceMappingURL=rooms.gateway.js.map