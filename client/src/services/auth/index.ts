import FetchService from "@services/fetch";
import { SignIn, SignUp } from "./interfaces";

export default class AuthService {
  private static instance: AuthService;

  private constructor(private fetchService: FetchService) {}

  static getInstance(fetchService: FetchService) {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(fetchService);
    }

    return AuthService.instance;
  }

  public async status() {
    return await this.fetchService.get("/status");
  }

  public async signIn(credentials: SignIn) {
    return await this.fetchService.post("/sign-in", credentials);
  }

  public async signUp(registration: SignUp) {
    return await this.fetchService.post("/sign-up", registration);
  }

  public async logOut() {
    return await this.fetchService.delete("/log-out");
  }

  public async recoverAccount(account: string) {
    return await this.fetchService.post("/forgot-password", { account });
  }

  public async resetPassword(token: string, password: string) {
    return await this.fetchService.post("/reset-password", { token, password });
  }
}
