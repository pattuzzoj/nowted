import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Req,
  Get,
  Query,
  UseGuards,
  Post,
  Delete,
  Res,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@shared/guards/auth.guard';
import type { AuthRequest } from '@shared/types';
import type { Response } from 'express';
import { messages } from '@utils/messages';
import { SetMessage } from '@shared/decorators/setMessage.decorator';
import UserService from './user.service';
import {
  ConfirmChangeEmailDto,
  ChangePasswordDto,
  ChangeUsernameDto,
  RequestChangeEmailDto,
} from './dto';

@Controller('/users')
export default class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() { user }: AuthRequest) {
    return await this.userService.getProfile(user.sub);
  }

  @Get('/check-username')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.USERNAME_AVAILABLE)
  async checkUsernameExists(@Query('username') username: string) {
    await this.userService.checkUsername(username);
  }

  @Get('/check-email')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.EMAIL_AVAILABLE)
  async checkEmailExists(@Query('email') email: string) {
    await this.userService.checkEmail(email);
  }

  @Post('/request-change-email')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.EMAIL_UPDATE_REQUESTED)
  async requestChangeEmail(
    @Req() { user }: AuthRequest,
    @Body() { newEmail }: RequestChangeEmailDto,
  ) {
    await this.userService.requestChangeEmail(user.sub, newEmail);
  }

  @Post('/confirm-change-email')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.EMAIL_UPDATED)
  async confirmChangeEmail(
    @Req() { user }: AuthRequest,
    @Body() { pin }: ConfirmChangeEmailDto,
  ) {
    await this.userService.confirmChangeEmail(user.sub, pin);
  }

  @Patch('/me/username')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.USERNAME_UPDATED)
  async changeUsername(
    @Req() { user }: AuthRequest,
    @Body() { username }: ChangeUsernameDto,
  ) {
    await this.userService.changeUsername(user.sub, username);
  }

  @Patch('/me/password')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.PASSWORD_UPDATED)
  async changePassword(
    @Req() { user }: AuthRequest,
    @Body() { currentPassword, newPassword }: ChangePasswordDto,
  ) {
    await this.userService.changePassword(
      user.sub,
      currentPassword,
      newPassword,
    );
  }

  @Delete('/delete-data')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.ACCOUNT_DELETED)
  async deleteData(@Req() { user }: AuthRequest) {
    await this.userService.deleteData(user.sub);
  }

  @Delete('')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.ACCOUNT_DELETED)
  async delete(
    @Req() { user }: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.userService.delete(user.sub);

    res.clearCookie('refresh-token', {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      domain: 'nowted-server.vercel.app',
    });
  }
}
