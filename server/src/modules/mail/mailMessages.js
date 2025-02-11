import { HttpStatus } from "@nestjs/common";

const success = {
  MAIL_SENT: {
    status: "success",
    statusCode: HttpStatus.OK,
    message: "Email Sent"
  }
}

const error = {}

export const MailMessages = {
  ...success,
  ...error
};