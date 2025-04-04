import { baseURL } from "../utils/constants";
import FetchService from "./fetchService";

export default class UserValidationService {
  private static instance: UserValidationService;
    private fetchService: FetchService;
  
    private constructor() {
      this.fetchService = new FetchService(baseURL.concat("/users"));
    }
  
    static getInstance() {
      if (!UserValidationService.instance) {
        UserValidationService.instance = new UserValidationService();
      }
  
      return UserValidationService.instance;
    }
  
    public async checkUsername(username: string) {
      const request = await this.fetchService.get("/check-username?username=" + username);
  
      if (!request.success) {
        return false;
      }
  
      return !request.data.exists;
    }
  
    public async checkEmail(email: string) {
      const request = await this.fetchService.get("/check-email?email=" + email);
  
      if (!request.success) {
        return false;
      }
      
      return !request.data.exists;
    }
}
