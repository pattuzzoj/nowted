import { Controller, Get, Post, Param, UseGuards, Request, Body } from "@nestjs/common";
import type { AuthRequest } from "@modules/auth/interface/authRequest.interface";
import { AuthGuard } from "@shared/guards/auth.guard";
import { SyncService } from "./sync.service";

@Controller("sync")
@UseGuards(AuthGuard)
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Get(":lastSync")
  async syncGetData(@Request() req: AuthRequest, @Param("lastSync") lastSync: string) {
    return await this.syncService.getData(req.user.sub, new Date(lastSync));
  }

  @Post()
  async syncPostData(@Request() req: AuthRequest, @Body() data: any) {
    return await this.syncService.syncData(req.user.sub, data);
  }
}