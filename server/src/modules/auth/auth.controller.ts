import { Controller, Post, Body, HttpStatus, HttpCode, Res, Get, Delete, UseGuards, Request } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import SignInDto from "../auth/dto/signIn.dto";
import SignUpDto from "../auth/dto/signUp.dto";
import { AuthGuard } from "../../shared/guards/auth.guard";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/status")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async status(@Request() req, @Res() res: Response) {
    if (!req?.user) {
      res.status(HttpStatus.UNAUTHORIZED).send();
    }
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
    });

    res.status(HttpStatus.OK).send();
  }

  @Post("/sign-up")
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() user: SignUpDto) {
    return await this.authService.signUp(user);
  }

  @Delete("/log-out")
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none"
    });

    res.status(HttpStatus.CREATED).send();
  }

  @Post("/recover-account")
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
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() req, @Body("password") password: string) {
   await this.authService.changePassword(req.user.sub, password);
  }
}