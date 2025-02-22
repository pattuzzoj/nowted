import { Controller, Get, Post, Param, UseGuards, Request, Body } from "@nestjs/common";
import type { AuthRequest } from "@shared/types";
import { AuthGuard } from "@shared/guards/auth.guard";
import { SyncService } from "./sync.service";
import { messages } from "@utils/messages";
import { SyncRecord } from "./sync.interface";
import { SetMessage } from "@shared/decorators/setMessage.decorator";

@Controller("sync")
@UseGuards(AuthGuard)
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Get(":lastSync")
  @SetMessage(messages.SYNCHRONIZED)
  async syncGetData(@Request() req: AuthRequest, @Param("lastSync") lastSync: string) {
    return await this.syncService.getData(req.user.sub, new Date(lastSync));
  }

  @Post()
  @SetMessage(messages.SYNCHRONIZED)
  async syncPostData(@Request() req: AuthRequest, @Body() data: SyncRecord[]) {
    await this.syncService.syncData(req.user.sub, data);
  }
}