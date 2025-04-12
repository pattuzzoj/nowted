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
  Req
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@shared/guards/auth.guard';
import { messages } from '@utils/messages';
import { SetMessage } from '@shared/decorators/setMessage.decorator';
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  TokenDto,
  ForgotPasswordDto,
} from './dto';
import AuthService from './auth.service';
import type { AuthRequest } from '@shared/types';

@Controller('/auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @SetMessage(messages.REGISTERED)
  async register(@Body() register: RegisterDto) {
    await this.authService.register(register);
  }

  @Post('/verify-email')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.EMAIL_VERIFIED)
  async verifyEmail(@Body() { token }: TokenDto) {
    await this.authService.verifyEmail(token);
  }

  @Post('/resend-verification')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.MAIL_SENT)
  async resendVerification(@Body() { token }: TokenDto) {
    await this.authService.resendVerification(token);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.LOGGED)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() login: LoginDto,
  ) {
    const { refreshToken, accessToken } = await this.authService.login(login);

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      domain: 'nowted-server.vercel.app',
    });

    return { accessToken };
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.TOKEN_REFRESH)
  async refreshToken(@Req() req: AuthRequest) {
    const accessToken = await this.authService.generateAccessToken(req.cookies['refresh-token']);
    return {
      accessToken,
    };
  }

  @Get('/verify-session')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.LOGGED)
  async verifySession(@Req() req: AuthRequest) {
    await this.authService.verifyToken(req.cookies['refresh-token'], 'refresh-token');
    // verify session with guard
  }

  @Delete('/logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @SetMessage(messages.LOGOUT)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh-token', {
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
  async recoverAccount(@Body() { account }: ForgotPasswordDto) {
    await this.authService.recoverAccount(account);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.PASSWORD_UPDATED)
  async resetPassword(@Body() { token, password }: ResetPasswordDto) {
    await this.authService.resetPassword(token, password);
  }

  @Post('/suspend-account')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @SetMessage(messages.ACCOUNT_SUSPENDED)
  async suspendUserAccount(
    @Req() { user }: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.suspendUserAccount(user.sub);

    res.clearCookie('refresh-token', {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      domain: 'nowted-server.vercel.app',
    });
  }
}
