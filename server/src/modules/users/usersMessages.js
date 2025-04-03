const success = {
  REGISTERED: "Register Successfully",
  USERNAME_UPDATED: "Username Updated Successfully",
  EMAIL_UPDATE_REQUESTED: "Email Change Requested Successfully",
  EMAIL_UPDATED: "Email Updated Successfully",
  PASSWORD_UPDATED: "Password Updated Successfully",
  ACCOUNT_ACTIVATED: "Account Activated Successfully",
  ACCOUNT_DELETED: "Account Deleted Successfully",
  EMAIL_AVAILABLE: "Email Is Available",
  USERNAME_AVAILABLE: "Username Is Available",
  ACCOUNT_SUSPENDED: "Account Suspended Successfully",
};

const error = {
  EMAIL_ALREADY_USED: "Email Already Used",
  USERNAME_ALREADY_USED: "User Already Used",
  ACCOUNT_NOT_EXIST: "Account Not Exists",
  EMAIL_NOT_AVAILABLE: "Email Is Not Available",
  USERNAME_NOT_AVAILABLE: "Username Is Not Available"
}

export const UsersMessages = {
  ...success,
  ...error
};
