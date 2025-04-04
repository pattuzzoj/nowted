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
  async getUserInfo(@Req() req: AuthRequest) {
    return await this.userService.getProfile(req.user.sub);
  }

  @Get('/check-username')
  @HttpCode(HttpStatus.OK)
  async checkUsernameExists(@Query('username') username: string) {
    const usernameExists = await this.userService.checkUsername(username);

    return {
      message: usernameExists
        ? messages.USERNAME_NOT_AVAILABLE
        : messages.USERNAME_AVAILABLE,
      data: {
        exists: usernameExists,
      },
    };
  }

  @Get('/check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmailExists(@Query('email') email: string) {
    const emailExists = await this.userService.checkEmail(email);

    return {
      message: emailExists
        ? messages.EMAIL_NOT_AVAILABLE
        : messages.EMAIL_AVAILABLE,
      data: {
        exists: emailExists,
      },
    };
  }

  @Post('/request-change-email')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.EMAIL_UPDATE_REQUESTED)
  async requestChangeEmail(
    @Req() req: AuthRequest,
    @Body() { newEmail }: RequestChangeEmailDto,
  ) {
    await this.userService.requestChangeEmail(req.user.sub, newEmail);
  }

  @Post('/confirm-change-email')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.EMAIL_UPDATED)
  async changeEmail(@Req() req: AuthRequest, @Body() { pin }: ConfirmChangeEmailDto) {
    await this.userService.handleChangeEmail(req.user.sub, Number(pin));
  }

  @Patch('/me/change-username')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.USERNAME_UPDATED)
  async changeUsername(
    @Req() req: AuthRequest,
    @Body() { username }: ChangeUsernameDto,
  ) {
    await this.userService.changeUsername(req.user.sub, username);
  }

  @Patch('/me/change-password')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.PASSWORD_UPDATED)
  async changePassword(
    @Req() req: AuthRequest,
    @Body() { currentPassword, newPassword }: ChangePasswordDto,
  ) {
    await this.userService.changePassword(
      req.user.sub,
      currentPassword,
      newPassword,
    );
  }

  @Delete('/delete-data')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.ACCOUNT_DELETED)
  async deleteAllData(@Req() req: AuthRequest) {
    await this.userService.deleteAllData(req.user.sub);
  }

  @Delete('')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.ACCOUNT_DELETED)
  async deleteAccount(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.userService.deleteAccount(req.user.sub);

    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      domain: 'nowted-server.vercel.app',
    });
  }
}
