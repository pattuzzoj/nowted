import { Controller, Get, Post, Param, UseGuards, Request, Body } from "@nestjs/common";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { SyncService } from "./sync.service";
import { SyncDto } from "./dto/sync.dto";

@Controller("sync")
@UseGuards(AuthGuard)
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Get(":lastSync")
  async syncGetData(@Request() req, @Param("lastSync") lastSync) {
    return await this.syncService.getData(req.user.sub, new Date(lastSync));
  }

  @Post()
  async syncPostData(@Request() req, @Body() data) {
    return await this.syncService.syncData(req.user.sub, data);
  }
}