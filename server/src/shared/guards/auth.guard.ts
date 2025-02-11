import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { messages } from "@utils/messages";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.jwt;

    if(!token) {
      throw new UnauthorizedException({
        ...messages.TOKEN_NOT_FOUND,
        timestamp: new Date().toISOString()
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env["JWT_SECRET"]! });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException({
        ...messages.INVALID_TOKEN,
        timestamp: new Date().toISOString()
      });
    }
  }
}