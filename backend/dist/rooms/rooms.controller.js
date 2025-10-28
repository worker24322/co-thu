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
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const rooms_service_1 = require("./rooms.service");
class CreateRoomDto {
    userId;
}
class JoinRoomDto {
    roomId;
    userId;
}
class FinishDto {
    roomId;
    winnerUserId;
}
let RoomsController = class RoomsController {
    roomsService;
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    list() {
        return this.roomsService.list();
    }
    create(body) {
        return this.roomsService.create(body.userId);
    }
    join(body) {
        return this.roomsService.join(body.roomId, body.userId);
    }
    finish(body) {
        return this.roomsService.finish(body.roomId, body.winnerUserId);
    }
};
exports.RoomsController = RoomsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRoomDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('join'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [JoinRoomDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "join", null);
__decorate([
    (0, common_1.Post)('finish'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FinishDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "finish", null);
exports.RoomsController = RoomsController = __decorate([
    (0, common_1.Controller)('rooms'),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsController);
//# sourceMappingURL=rooms.controller.js.map