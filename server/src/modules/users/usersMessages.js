const success = {
  REGISTERED: "Register Successfully",
  USERNAME_UPDATED: "Username Updated Successfully",
  EMAIL_UPDATED: "Email Updated Successfully",
  PASSWORD_UPDATED: "Password Updated Successfully",
  ACCOUNT_ACTIVATED: "Account Activated Successfully",
  ACCOUNT_DELETED: "Account Deleted Successfully"
}

const error = {
  EMAIL_ALREADY_USED: "Email Already Used",
  USERNAME_ALREADY_USED: "User Already Used",
  ACCOUNT_NOT_EXIST: "Account Not Exists",
}

export const UsersMessages = {
  ...success,
  ...error
};