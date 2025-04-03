import FetchService from "@/shared/services/fetchService";
import { messages } from "@/shared/utils/messages";
import { Notify } from "@/shared/utils/decorators/notify";
import { baseURL } from "@/shared/utils/constants";
import UserValidationService from "@/shared/services/userValidationService";
import type { Login, Register } from "../types";

export default class AuthService {
  private static instance: AuthService;
  private fetchService: FetchService;
  private userValidationService: UserValidationService;

  private constructor() {
    this.fetchService = new FetchService(baseURL.concat("/auth"));
    this.userValidationService = UserValidationService.getInstance();
  }

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  public async checkUsername(username: string) {
    return this.userValidationService.checkUsername(username);
  }

  public async checkEmail(email: string) {
    return this.userValidationService.checkEmail(email);
  }

  public async isValidToken() {
    return await this.fetchService.get("/verify-token");
  }

  @Notify(messages.LOGIN)
  public async login(credentials: Login) {
    return await this.fetchService.post("/login", credentials);
  }

  @Notify(messages.REGISTER)
  public async register(registration: Register) {
    return await this.fetchService.post("/register", registration);
  }

  @Notify(messages.LOGOUT)
  public async logout() {
    return await this.fetchService.delete("/logout");
  }

  @Notify(messages.ACTIVATE_ACCOUNT)
  public async activateAccount(token: string) {
    await this.fetchService.post("/activate-account", { token });
  }

  @Notify(messages.ACCOUNT_RECOVERY)
  public async recoverAccount(account: string) {
    await this.fetchService.post("/forgot-password", { account });
  }

  @Notify(messages.RESET_PASSWORD)
  public async resetPassword(token: string, password: string) {
    await this.fetchService.post("/reset-password", { token, password });
  }
}
