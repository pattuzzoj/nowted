import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@shared/guards/auth.guard';
import type { AuthRequest } from '@shared/types';
import { messages } from '@utils/messages';
import { SetMessage } from '@shared/decorators/setMessage.decorator';
import IUserService from './user.service.abstract';

@Controller('/users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: IUserService) {}

  @Patch('/change-email')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.EMAIL_UPDATED)
  async changeEmail(@Req() req: AuthRequest, @Body('email') email: string) {
    await this.userService.changeEmail(req.user.sub, email);
  }

  @Patch('/change-username')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.USERNAME_UPDATED)
  async changeUsername(@Req() req: AuthRequest, @Body('username') username: string) {
    await this.userService.changeUsername(req.user.sub, username);
  }

  @Patch('/change-password')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.PASSWORD_UPDATED)
  async changePassword(@Req() req: AuthRequest, @Body('password') password: string) {
    await this.userService.changePassword(req.user.sub, password);
  }
}
