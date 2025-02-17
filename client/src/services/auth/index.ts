import FetchService from "@services/fetch";
import type { SignIn, SignUp } from "./interfaces";
import { messages } from "@/utils/messages";
import { Notify } from "@/utils/notify";
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
    await this.fetchService.get("/status");
  }

  @Notify(messages.LOGIN)
  public async signIn(credentials: SignIn) {
    await this.fetchService.post("/sign-in", credentials);
  }

  @Notify(messages.REGISTER)
  public async signUp(registration: SignUp) {
    await this.fetchService.post("/sign-up", registration);
  }

  @Notify(messages.LOGOUT)
  public async logOut() {
    await this.fetchService.delete("/log-out");
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