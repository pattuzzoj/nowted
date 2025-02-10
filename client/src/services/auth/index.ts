import FetchService from "@services/fetch";
import { baseURL } from "@utils/constants";
import { SignIn, SignUp } from "./interfaces";

export default class AuthService {
  private static fetchService: FetchService = new FetchService(baseURL.concat("/auth"));

  static async status() {
    return await this.fetchService.get("/status");
  }

  static async signIn(credentials: SignIn) {
    return await this.fetchService.post("/sign-in", credentials);
  }

  static async signUp(registration: SignUp) {
    return await this.fetchService.post("/sign-up", registration);
  }

  static async logOut() {
    return await this.fetchService.delete("/log-out");
  }

  static async recoverAccount(account: string) {
    return await this.fetchService.post("/forgot-password", { account });
  }

  static async resetPassword(token: string, password: string) {
    return await this.fetchService.post("/reset-password", { token, password });
  }
}
