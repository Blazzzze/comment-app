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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const comment_entity_1 = require("./comment.entity");
let CommentsService = class CommentsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll() {
        return this.repo.findTrees();
    }
    async create(dto, user) {
        const comment = this.repo.create({ content: dto.content, author: user });
        if (dto.parentId) {
            const parent = await this.repo.findOne({ where: { id: dto.parentId } });
            if (!parent)
                throw new common_1.NotFoundException('Parent comment not found');
            comment.parent = parent;
        }
        return this.repo.save(comment);
    }
    async update(id, dto, user) {
        const comment = await this.repo.findOne({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.author.id !== user.id) {
            throw new common_1.ForbiddenException('You can only edit your own comments');
        }
        const fifteenMin = 1000 * 60 * 15;
        if (Date.now() - comment.createdAt.getTime() > fifteenMin) {
            throw new common_1.BadRequestException('Edit window expired');
        }
        comment.content = dto.content;
        if (dto.parentId) {
            const parent = await this.repo.findOne({ where: { id: dto.parentId } });
            if (!parent)
                throw new common_1.NotFoundException('Parent comment not found');
            comment.parent = parent;
        }
        return this.repo.save(comment);
    }
    async softDelete(id, user) {
        const comment = await this.repo.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.author.id !== user.id) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        comment.deletedAt = new Date();
        comment.deletedUntil = new Date(Date.now() + 15 * 60 * 1000);
        return this.repo.save(comment);
    }
    async restore(id, user) {
        const comment = await this.repo.findOne({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.author.id !== user.id) {
            throw new common_1.ForbiddenException('You can only restore your own comments');
        }
        if (!comment.deletedUntil || comment.deletedUntil < new Date()) {
            throw new common_1.BadRequestException('Restore period has expired');
        }
        comment.deletedAt = null;
        comment.deletedUntil = null;
        return this.repo.save(comment);
    }
    async purgeExpired() {
        const expired = await this.repo.find({
            where: { deletedUntil: (0, typeorm_2.LessThan)(new Date()) },
        });
        await this.repo.remove(expired);
        console.log(`Purged ${expired.length} comments`);
    }
};
exports.CommentsService = CommentsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommentsService.prototype, "purgeExpired", null);
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.TreeRepository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map