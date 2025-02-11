import { HttpStatus } from "@nestjs/common";

const success = {
  REGISTERED: {
    status: "success",
    statusCode: HttpStatus.CREATED,
    message: "Register Successfully"
  },
  USERNAME_UPDATED: {
    status: "success",
    statusCode: HttpStatus.OK,
    message: "Username Updated Successfully"
  },
  EMAIL_UPDATED: {
    status: "success",
    statusCode: HttpStatus.OK,
    message: "Email Updated Successfully"
  },
  PASSWORD_UPDATED: {
    status: "success",
    statusCode: HttpStatus.OK,
    message: "Password Updated Successfully"
  }
}

const error = {
  EMAIL_ALREADY_USED: {
    status: "error",
    statusCode: HttpStatus.CONFLICT,
    message: "Email Already Used",
  },
  USERNAME_ALREADY_USED: {
    status: "error",
    statusCode: HttpStatus.CONFLICT,
    message: "User Already Used",
  },
  ACCOUNT_NOT_EXIST: {
    status: "error",
    statusCode: HttpStatus.UNAUTHORIZED,
    message: "Account Not Exists",
  }
}

export const UsersMessages = {
  ...success,
  ...error
};