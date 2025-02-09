import { Controller, Post, Body, HttpStatus, HttpCode, Res, Get, Delete, UseGuards, Req } from "@nestjs/common";
import type { Response } from "express";
import { AuthGuard } from "@shared/guards/auth.guard";
import { AuthService } from "./auth.service";
import SignInDto from "../auth/dto/signIn.dto";
import SignUpDto from "../auth/dto/signUp.dto";
import type { AuthRequest } from "./interface/authRequest.interface";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/status")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async status() {
    return;
  }

  @Post("/sign-in")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() user: SignInDto, @Res() res: Response) {
    const token = await this.authService.signIn(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none"
    }).status(HttpStatus.OK).send();
  }

  @Post("/sign-up")
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() user: SignUpDto) {
    return await this.authService.signUp(user);
  }

  @Delete("/log-out")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res() res: Response) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none"
    }).status(HttpStatus.OK).send();
  }

  @Post("/forgot-password")
  @HttpCode(HttpStatus.OK)
  async recoverAccount(@Body("account") account: string) {
    await this.authService.recoverAccount(account);
  }

  @Post("/reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body("token") token: string, @Body("password") password: string) {
   await this.authService.resetPassword(token, password);
  }

  @Post("/change-password")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: AuthRequest, @Body("password") password: string) {
   await this.authService.changePassword(req.user.sub, password);
  }
}