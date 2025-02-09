import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@shared/guards/auth.guard";
import { UserService } from "./user.service";
import type { AuthRequest } from "@modules/auth/interface/authRequest.interface";

@Controller("/users")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/change-username")
  @HttpCode(HttpStatus.OK)
  async changeUsername(@Req() req: AuthRequest, @Body("email") username: string) {
   await this.userService.changeUsername(req.user.sub, username);
  }

  @Post("/change-email")
  @HttpCode(HttpStatus.OK)
  async changeEmail(@Req() req: AuthRequest, @Body("email") email: string) {
   await this.userService.changeEmail(req.user.sub, email);
  }

  @Post("/change-password")
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: AuthRequest, @Body("password") password: string) {
   await this.userService.changePassword(req.user.sub, password);
  }
}