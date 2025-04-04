import FetchService from "@/shared/services/fetchService";
import { messages } from "@/shared/utils/messages";
import { Notify } from "@/shared/utils/decorators/notify";
import { baseURL } from "@/shared/utils/constants";
import UserValidationService from "@/shared/services/userValidationService";
import { SetStoreFunction } from "solid-js/store";

type ProfileType = {
  username: string;
  email: string;
}

export default class UserService {
  private static instance: UserService;
  private fetchService: FetchService;
  private userValidationService: UserValidationService;

  private constructor(
    private profile: ProfileType,
    private setProfile: SetStoreFunction<ProfileType>
  ) {
    this.fetchService = new FetchService(baseURL.concat("/users"));
    this.userValidationService = UserValidationService.getInstance();
  }

  static getInstance(
    profile: ProfileType,
    setProfile: SetStoreFunction<ProfileType>
  ) {
    if (!UserService.instance) {
      UserService.instance = new UserService(profile, setProfile);
    }

    return UserService.instance;
  }

  public async checkUsername(username: string) {
    return await this.userValidationService.checkUsername(username);
  }

  public async checkEmail(email: string) {
    return await this.userValidationService.checkEmail(email);
  }

  public async getProfile() {
    const result = await this.fetchService.get("/me");

    if (!result.success) {
      return null;
    }

    return result.data;
  }

  @Notify(messages.USERNAME_CHANGE)
  public async changeUsername(username: string, password: string) {
    const result = await this.fetchService.patch("/me/change-username", {
      username,
      password,
    });

    return result.success;
  }

  @Notify(messages.PASSWORD_CHANGE)
  public async changePassword(currentPassword: string, newPassword: string) {
    await this.fetchService.patch("/me/change-password", {
      currentPassword,
      newPassword,
    });
  }

  @Notify(messages.EMAIL_CHANGE_REQUEST)
  public async requestChangeEmail(newEmail: string, password: string) {
    await this.fetchService.post("/request-change-email", {
      newEmail,
      password,
    });
  }

  @Notify(messages.EMAIL_CHANGE_CONFIRM)
  public async confirmChangeEmail(pin: string) {
    const result = await this.fetchService.post("/confirm-change-email", { pin });
    return result.success;
  }

  public async deleteData() {
    await this.fetchService.delete("/delete-data");
  }

  public async deleteAccount() {
    await this.fetchService.delete("");
  }
}
