import { Controller, Post, Body, HttpStatus, HttpCode, Res, Get, Delete, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { AuthGuard } from "@shared/guards/auth.guard";
import { AuthService } from "./auth.service";
import SignInDto from "../auth/dto/signIn.dto";
import SignUpDto from "../auth/dto/signUp.dto";
import { messages } from "@utils/messages";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/verify-token")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async verifyToken() {
    return {
      ...messages.LOGGED,
      timestamp: new Date().toISOString()
    }
  }

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() user: SignInDto, @Res() res: Response) {
    const token = await this.authService.signIn(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      domain: "nowted-server.vercel.app"
    }).status(HttpStatus.OK).send({
      ...messages.LOGGED,
      timestamp: new Date().toISOString()
    });
  }

  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() user: SignUpDto) {
    await this.authService.signUp(user);

    return {
      ...messages.REGISTERED,
      timestamp: new Date().toISOString()
    }
  }

  @Post("/activate-account")
  @HttpCode(HttpStatus.OK)
  async activateAccount(@Body("token") token: string) {
    await this.authService.activateAccount(token);

    return {
      ...messages.ACCOUNT_ACTIVATED,
      timestamp: new Date().toISOString()
    }
  }

  @Delete("/logout")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res() res: Response) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      domain: "nowted-server.vercel.app"
    }).status(HttpStatus.OK).send({
      ...messages.LOGOUT,
      timestamp: new Date().toISOString()
    });
  }

  @Delete("/delete-account")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Res() res: Response) {
    await this.authService.deleteAccount();

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      domain: "nowted-server.vercel.app"
    }).status(HttpStatus.OK).send({
      ...messages.ACCOUNT_DELETED,
      timestamp: new Date().toISOString()
    });
  }

  @Post("/forgot-password")
  @HttpCode(HttpStatus.OK)
  async recoverAccount(@Body("account") account: string) {
    await this.authService.recoverAccount(account);

    return {
      ...messages.MAIL_SENT,
      timestamp: new Date().toISOString()
    }
  }

  @Post("/reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body("token") token: string, @Body("password") password: string) {
   await this.authService.resetPassword(token, password);

   return {
    ...messages.PASSWORD_UPDATED,
    timestamp: new Date().toISOString()
   }
  }
}