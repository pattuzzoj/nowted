import api from "./api";

export default class UserValidationService {
  private static instance: UserValidationService;

  private constructor() {}

  static getInstance() {
    if (!UserValidationService.instance) {
      UserValidationService.instance = new UserValidationService();
    }

    return UserValidationService.instance;
  }

  public async checkUsername(username: string) {
    try {
      const response = await api.get("users/check-username", {
        params: { username }
      });
  
      if (!(response.statusText === "OK")) {
        throw new Error(`HTTP Status error: ${response.status}`);
      }
  
      return true;
    } catch {
      return false;
    }
  }

  public async checkEmail(email: string) {
    try {
      const response = await api.get("users/check-email", {
        params: { email },
      });
  
      if (!(response.statusText === "OK")) {
        throw new Error(`HTTP Status error: ${response.status}`);
      }
  
      return true;
    } catch {
      return false;
    }
  }
}
