import { messages } from "@/shared/utils/messages";
import { Notify } from "@/shared/utils/decorators/notify";
import UserValidationService from "@/shared/services/userValidationService";
import type { Login, Register } from "../types";
import api from "@/shared/services/api";

export default class AuthService {
  private static instance: AuthService;
  private baseURL = "/auth";
  private userValidationService: UserValidationService;

  private constructor() {
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

  public async isValidSession() {
    return await api.get(`${this.baseURL}/verify-session`, { withCredentials: true });
  }
  
  @Notify(messages.LOGIN)
  public async login(credentials: Login) {
    const {data} = await api.post<{ accessToken: string }>(
      `${this.baseURL}/login`,
      credentials
    );

    if (data.accessToken) {
      localStorage.setItem("AUTH_TOKEN", `Bearer ${data.accessToken}`);
    }
  }

  @Notify(messages.REGISTER)
  public async register(registration: Register) {
    await api.post(`${this.baseURL}/register`, registration);
  }

  @Notify(messages.LOGOUT)
  public async logout() {
    await api.delete(`${this.baseURL}/logout`);
  }

  @Notify(messages.ACTIVATE_ACCOUNT)
  public async activateAccount(token: string) {
    await api.post(`${this.baseURL}/verify-email`, { token });
  }

  @Notify(messages.RESEND_EMAIL)
  public async resendVerification(token: string) {
    await api.post(`${this.baseURL}/resend-verification`, { token });
  }

  @Notify(messages.ACCOUNT_RECOVERY)
  public async recoverAccount(account: string) {
    await api.post(`${this.baseURL}/forgot-password`, { account });
  }

  @Notify(messages.RESET_PASSWORD)
  public async resetPassword(token: string, password: string) {
    await api.post(`${this.baseURL}/reset-password`, {
      token,
      password,
    });
  }

  @Notify(messages.ACCOUNT_SUSPENDED)
  public async suspendAccount() {
    await api.post(`${this.baseURL}/suspend-account`);
  }
}
