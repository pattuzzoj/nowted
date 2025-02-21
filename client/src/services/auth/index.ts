import FetchService from "@services/fetch";
import type { Login, Register } from "./interfaces";
import { messages } from "@/utils/messages";
import { Notify } from "@/utils/decorators/notify";
import { baseURL } from "@/utils/constants";

export default class AuthService {
  private static instance: AuthService;
  private fetchService: FetchService;

  private constructor() {
    this.fetchService = new FetchService(baseURL.concat("/auth"));
  }

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  public async isValidToken() {
    return await this.fetchService.get("/status");
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