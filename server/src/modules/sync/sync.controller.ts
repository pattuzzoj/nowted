import { Controller, Get, Post, Param, UseGuards, Request, Body } from "@nestjs/common";
import type { AuthRequest } from "@modules/auth/interface/authRequest.interface";
import { AuthGuard } from "@shared/guards/auth.guard";
import { SyncService } from "./sync.service";
import { messages } from "@utils/messages";
import { SyncRecord } from "./sync.interface";

@Controller("sync")
@UseGuards(AuthGuard)
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Get(":lastSync")
  async syncGetData(@Request() req: AuthRequest, @Param("lastSync") lastSync: string) {
    const data = await this.syncService.getData(req.user.sub, new Date(lastSync));

    return {
      ...messages.SYNCHRONIZED,
      data,
      timestamp: new Date().toISOString()
    }
  }

  @Post()
  async syncPostData(@Request() req: AuthRequest, @Body() data: SyncRecord[]) {
    await this.syncService.syncData(req.user.sub, data);
    
    return {
      ...messages.SYNCHRONIZED,
      timestamp: new Date().toISOString()
    }
  }
}