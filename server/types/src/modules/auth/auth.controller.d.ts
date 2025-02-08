import type { Response } from "express";
import { AuthService } from "./auth.service";
import SignInDto from "../auth/dto/signIn.dto";
import SignUpDto from "../auth/dto/signUp.dto";
import type { AuthRequest } from "./interface/authRequest.interface";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    status(): Promise<void>;
    signIn(user: SignInDto, res: Response): Promise<void>;
    signUp(user: SignUpDto): Promise<void>;
    logout(res: Response): Promise<void>;
    recoverAccount(account: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
    changePassword(req: AuthRequest, password: string): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map