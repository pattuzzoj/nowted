import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Res,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@shared/guards/auth.guard';
import { AuthService } from './auth.service';
import LoginDto from './dto/login.dto';
import RegisterDto from './dto/register.dto';
import ResetPasswordDto from './dto/reset-password.dto';
import TokenDto from './dto/token.dto';
import ForgotPasswordDto from './dto/forgot-password.dto';
import { messages } from '@utils/messages';
import { SetMessage } from '@shared/decorators/responseApi.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/verify-token')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.LOGGED)
  async verifyToken() {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.LOGGED)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(loginDto);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      domain: 'nowted-server.vercel.app',
    });
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @SetMessage(messages.REGISTERED)
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
  }

  @Post('/activate-account')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.ACCOUNT_ACTIVATED)
  async activateAccount(@Body() tokenDto: TokenDto) {
    await this.authService.activateAccount(tokenDto);
  }

  @Delete('/logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @SetMessage(messages.LOGOUT)
  async logout(@Res() res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      domain: 'nowted-server.vercel.app',
    });
  }

  // @Delete("/delete-account")
  // @UseGuards(AuthGuard)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteAccount(@Res() res: Response) {
  //   await this.authService.deleteAccount();

  //   res.clearCookie("jwt", {
  //     httpOnly: true,
  //     secure: true,
  //     maxAge: 30 * 24 * 60 * 60 * 1000,
  //     sameSite: "none",
  //     domain: "nowted-server.vercel.app"
  //   }).status(HttpStatus.OK).send({
  //     ...messages.ACCOUNT_DELETED,
  //     timestamp: new Date().toISOString()
  //   });
  // }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.MAIL_SENT)
  async recoverAccount(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.recoverAccount(forgotPasswordDto.account);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.PASSWORD_UPDATED)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
  }
}