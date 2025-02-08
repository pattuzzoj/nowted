import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
export declare class BlockNonBrowser implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
//# sourceMappingURL=blockNonBrowser.middleware.d.ts.map