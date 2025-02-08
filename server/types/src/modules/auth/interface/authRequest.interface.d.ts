import { Request } from "express";
export interface AuthRequest extends Request {
    user: {
        sub: string;
        email: string;
    };
}
//# sourceMappingURL=authRequest.interface.d.ts.map