import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  Delete,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@shared/guards/auth.guard';
import LoginDto from './dto/login.dto';
import RegisterDto from './dto/register.dto';
import ResetPasswordDto from './dto/reset-password.dto';
import TokenDto from './dto/token.dto';
import ForgotPasswordDto from './dto/forgot-password.dto';
import { messages } from '@utils/messages';
import { SetMessage } from '@shared/decorators/setMessage.decorator';
import type { AuthRequest } from '@shared/types';
import IAuthService from './auth.service.abstract';

@Controller('/auth')
export class AuthController {
  constructor(private authService: IAuthService) {}

  @Get('/verify-token')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.LOGGED)
  async verifyToken() {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.LOGGED)
  async login(@Res({passthrough: true}) res: Response, @Body() loginDto: LoginDto) {
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
    await this.authService.activateAccount(tokenDto.token);
  }

  // @Post('/resend-activation-token')
  // @HttpCode(HttpStatus.OK)
  // @SetMessage(messages.MAIL_SENT)
  // async resendActivationToken(@Body() tokenDto: TokenDto) {
  //   await this.authService.resendActivationToken(tokenDto);
  // }

  @Delete('/logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @SetMessage(messages.LOGOUT)
  async logout(@Res({passthrough: true}) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      domain: 'nowted-server.vercel.app',
    });
  }

  @Delete('/delete-account')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @SetMessage(messages.ACCOUNT_DELETED)
  async deleteAccount(@Req() req: AuthRequest, @Res({passthrough: true}) res: Response) {
    await this.authService.deleteAccount(req.user.sub);

    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      domain: 'nowted-server.vercel.app',
    });
  }

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
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
  }
}
