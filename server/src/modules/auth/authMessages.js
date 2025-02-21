const success = {
  LOGGED: "Logged Successfully",
  LOGOUT: "Logout Successfully"
}

const error = {
  INVALID_CREDENTIALS: "Invalid Credentials",
  INVALID_TOKEN: "Invalid Token",
  TOKEN_NOT_FOUND: "Token Not Found",
  ACCOUNT_NOT_ACTIVE: "Account Not Active"
}

export const AuthMessages = {
  ...success,
  ...error
};