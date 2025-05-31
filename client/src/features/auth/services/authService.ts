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

  async checkUsername(username: string) {
    return this.userValidationService.checkUsername(username);
  }

  async checkEmail(email: string) {
    return this.userValidationService.checkEmail(email);
  }

  async isValidSession() {
    return await api.get(`${this.baseURL}/verify-session`, { withCredentials: true });
  }
  
  @Notify(messages.LOGIN)
  async login(credentials: Login) {
    const {data} = await api.post<{ accessToken: string }>(
      `${this.baseURL}/login`,
      credentials,
      { withCredentials: true }
    );

    if (data.accessToken) {
      localStorage.setItem("AUTH_TOKEN", data.accessToken);
    }
  }

  @Notify(messages.REGISTER)
  async register(registration: Register) {
    await api.post(`${this.baseURL}/register`, registration);
  }

  @Notify(messages.LOGOUT)
  async logout() {
    await api.delete(`${this.baseURL}/logout`);
  }

  @Notify(messages.ACTIVATE_ACCOUNT)
  async activateAccount(token: string) {
    await api.post(`${this.baseURL}/verify-email`, { token });
  }

  @Notify(messages.RESEND_EMAIL)
  async resendVerification(token: string) {
    await api.post(`${this.baseURL}/resend-verification`, { token });
  }

  @Notify(messages.ACCOUNT_RECOVERY)
  async recoverAccount(account: string) {
    await api.post(`${this.baseURL}/forgot-password`, { account });
  }

  @Notify(messages.RESET_PASSWORD)
  async resetPassword(token: string, password: string) {
    await api.post(`${this.baseURL}/reset-password`, {
      token,
      password,
    });
  }

  @Notify(messages.ACCOUNT_SUSPENDED)
  async suspendAccount() {
    await api.post(`${this.baseURL}/suspend-account`);
  }
}
