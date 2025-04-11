const success = {
  LOGGED: "Logged Successfully",
  LOGOUT: "Logout Successfully",
  TOKEN_REFRESH: "Token Refresh"
}

const error = {
  INVALID_CREDENTIALS: "Invalid Credentials",
  INVALID_TOKEN: "Invalid Token",
  TOKEN_NOT_FOUND: "Token Not Found"
}

export const AuthMessages = {
  ...success,
  ...error
};
