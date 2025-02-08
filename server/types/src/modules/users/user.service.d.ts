import type { DatabaseType } from "@root/drizzle.config";
import { User } from "./interface/user.interface";
export declare class UserService {
    private db;
    constructor(db: DatabaseType);
    create(user: User): Promise<import("drizzle-orm/neon-http").NeonHttpQueryResult<never>>;
    findOne(login: string): Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
    } | undefined>;
    changePassword(id: string, password: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map