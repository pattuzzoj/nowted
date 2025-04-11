import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { messages } from "@utils/messages";
import type { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(messages.TOKEN_NOT_FOUND);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env['JWT_SECRET']!,
      });

      if (payload.purpose !== 'access-token') {
        throw new UnauthorizedException(messages.INVALID_TOKEN);
      }

      request.user = payload;
    } catch {
      throw new UnauthorizedException(messages.INVALID_TOKEN);
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
