import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Body,
  Req,
} from '@nestjs/common';
import type { AuthRequest } from '@shared/types';
import { AuthGuard } from '@shared/guards/auth.guard';
import { messages } from '@utils/messages';
import { SyncRecord } from './sync.interface';
import { SetMessage } from '@shared/decorators/setMessage.decorator';
import SyncService from './sync.service';

@Controller('sync')
@UseGuards(AuthGuard)
export default class SyncController {
  constructor(private syncService: SyncService) {}

  @Get(':lastSync')
  @SetMessage(messages.SYNCHRONIZED)
  async syncFetch(
    @Req() {user}: AuthRequest,
    @Param('lastSync') lastSync: string,
  ) {
    return await this.syncService.fetch(user.sub, lastSync);
  }

  @Post()
  @SetMessage(messages.SYNCHRONIZED)
  async syncPush(@Req() {user}: AuthRequest, @Body() data: SyncRecord[]) {
    await this.syncService.push(user.sub, data);
  }
}
