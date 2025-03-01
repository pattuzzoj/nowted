import { Controller, Get, Post, Param, UseGuards, Request, Body } from "@nestjs/common";
import type { AuthRequest } from "@shared/types";
import { AuthGuard } from "@shared/guards/auth.guard";
import { messages } from "@utils/messages";
import { SyncRecord } from "./sync.interface";
import { SetMessage } from "@shared/decorators/setMessage.decorator";
import ISyncService from "./sync.service.abstract";

@Controller("sync")
@UseGuards(AuthGuard)
export class SyncController {
  constructor(private syncService: ISyncService) {}

  @Get(":lastSync")
  @SetMessage(messages.SYNCHRONIZED)
  async syncFetch(@Request() req: AuthRequest, @Param("lastSync") lastSync: string) {
    return await this.syncService.fetch(req.user.sub, lastSync);
  }

  @Post()
  @SetMessage(messages.SYNCHRONIZED)
  async syncPush(@Request() req: AuthRequest, @Body() data: SyncRecord[]) {
    await this.syncService.push(req.user.sub, data);
  }
}