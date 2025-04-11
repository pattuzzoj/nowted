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
      await api.get("users/check-username", {
        params: { username }
      });

      return true;
    } catch {
      return false;
    }
  }

  public async checkEmail(email: string) {
    try {
      await api.get("users/check-email", {
        params: { email },
      });
  
      return true;
    } catch {
      return false;
    }
  }
}
