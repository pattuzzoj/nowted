import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class BlockNonBrowser implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.headers['user-agent'];

    if (process.env.NODE_ENV === "production" && (userAgent && userAgent.includes('Mozilla/5.0'))) {
      next();
    } else {
      res.status(403).json({ error: 'Access forbidden' });
    }
  }
}