import { baseURL } from "utils/constants";
import { SignIn, SignUp } from "./interfaces";

export default class AuthService {
  private static url: string = baseURL.concat("/auth");

  private static async request(endpoint: string, method: "GET" | "POST" | "DELETE", body?: Record<string, any>) {
    try {
      const request = await fetch(AuthService.url.concat(endpoint), {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        mode: 'cors',
        body: body ? JSON.stringify(body) : undefined
      });

      return request.ok;
    } catch (error) {
      console.error(error);
    }
  }

  static async status() {
    return await AuthService.request("/status", "GET");
  }

  static async signIn(credentials: SignIn) {
    return await AuthService.request("/sign-in", "POST", credentials);
  }

  static async signUp(registration: SignUp) {
    return await AuthService.request("/sign-up", "POST", registration);
  }

  static async logOut() {
    return await AuthService.request("/log-out", "DELETE");
  }

  static async recoverAccount(account: string) {
    return await AuthService.request("/recover-account", "POST", {account});
  }

  static async resetPassword(token: string, password: string) {
    return await AuthService.request("/reset-password", "POST", {token, password});
  }
}
