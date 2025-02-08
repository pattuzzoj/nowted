import { JwtService } from "@nestjs/jwt";
import { UserService } from "@modules/users/user.service";
import { MailService } from "@modules/mail/mail.service";
import SignInDto from "../auth/dto/signIn.dto";
import SignUpDto from "../auth/dto/signUp.dto";
export declare class AuthService {
    private jwtService;
    private users;
    private mailService;
    constructor(jwtService: JwtService, users: UserService, mailService: MailService);
    signIn({ login, password }: SignInDto): Promise<string>;
    signUp(user: SignUpDto): Promise<void>;
    changePassword(userId: string, password: string): Promise<void>;
    recoverAccount(account: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map