import { HttpStatus } from "@nestjs/common";

const success = {
  LOGGED: {
    status: "success",
    statusCode: HttpStatus.OK,
    message: "Logged Successfully"
  },
  LOGOUT: {
    status: "success",
    statusCode: HttpStatus.OK,
    message: "Logout Successfully"
  }
}

const error = {
  INVALID_CREDENTIALS: {
    status: "error",
    statusCode: HttpStatus.UNAUTHORIZED,
    message: "Invalid Credentials"
  },
  INVALID_TOKEN: {
    status: "error",
    statusCode: HttpStatus.UNAUTHORIZED,
    message: "Invalid Token",
  }
}

export const AuthMessages = {
  ...success,
  ...error
};