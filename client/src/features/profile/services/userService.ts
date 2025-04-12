import { messages } from "@/shared/utils/messages";
import { Notify } from "@/shared/utils/decorators/notify";
import UserValidationService from "@/shared/services/userValidationService";
import { SetStoreFunction } from "solid-js/store";
import { ResponseDataType } from "@/shared/types";
import api from "@/shared/services/api";

type ProfileType = {
  username: string;
  email: string;
};

export default class UserService {
  private static instance: UserService;
  private baseURL = "/users";
  private userValidationService: UserValidationService;

  private constructor(
    private profile: ProfileType,
    private setProfile: SetStoreFunction<ProfileType>
  ) {
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
    const response = await api.get<ResponseDataType>(this.baseURL + "/me");
    return response.data;
  }

  @Notify(messages.USERNAME_CHANGE)
  public async changeUsername(username: string, password: string) {
    await api.patch<ResponseDataType>(this.baseURL + "/me/username", {
      username,
      password,
    });
  }

  @Notify(messages.PASSWORD_CHANGE)
  public async changePassword(currentPassword: string, newPassword: string) {
    await api.patch<ResponseDataType>(this.baseURL + "/me/password", {
      currentPassword,
      newPassword,
    });
  }

  @Notify(messages.EMAIL_CHANGE_REQUEST)
  public async requestChangeEmail(newEmail: string, password: string) {
    await api.post<ResponseDataType>(this.baseURL + "/request-change-email", {
      newEmail,
      password,
    });
  }

  @Notify(messages.EMAIL_CHANGE_CONFIRM)
  public async confirmChangeEmail(pin: number) {
    await api.post<ResponseDataType>(this.baseURL + "/confirm-change-email", {
      pin,
    });
  }

  @Notify(messages.DELETING_DATA)
  public async deleteData() {
    await api.delete<ResponseDataType>(this.baseURL + "/delete-data");
  }

  @Notify(messages.DELETING_ACCOUNT)
  public async deleteAccount() {
    await api.delete<ResponseDataType>(this.baseURL);
  }
}
