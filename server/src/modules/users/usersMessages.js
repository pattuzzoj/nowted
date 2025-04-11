const success = {
  REGISTERED: "Register Successfully",
  USERNAME_UPDATED: "Username Updated Successfully",
  EMAIL_UPDATE_REQUESTED: "Email Change Requested Successfully",
  EMAIL_UPDATED: "Email Updated Successfully",
  EMAIL_VERIFIED: "Email Verified Successfully",
  EMAIL_NOT_VERIFIED: "Email Not Verified Successfully",
  PASSWORD_UPDATED: "Password Updated Successfully",
  ACCOUNT_DELETED: "Account Deleted Successfully",
  EMAIL_AVAILABLE: "Email Is Available",
  USERNAME_AVAILABLE: "Username Is Available",
  ACCOUNT_SUSPENDED: "Account Suspended Successfully",
  ACCOUNT_REACTIVATED: "Account Reactivated Successfully"
};

const error = {
  EMAIL_ALREADY_USED: "Email Already Used",
  EMAIL_ALREADY_VERIFIED: "Email Already Verified",
  USERNAME_ALREADY_USED: "User Already Used",
  EMAIL_NOT_AVAILABLE: "Email Is Not Available",
  USERNAME_NOT_AVAILABLE: "Username Is Not Available",
  USER_NOT_FOUND: "User Not Found",
  ACCOUNT_ALREADY_SUSPENDED: "Account Already Suspended",
  ACCOUNT_NOT_SUSPENDED: "Account Not Suspended",
}

export const UsersMessages = {
  ...success,
  ...error
};
