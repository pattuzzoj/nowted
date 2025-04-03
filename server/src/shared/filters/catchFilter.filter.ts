// @ts-nocheck

import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import type { Response } from "express";

@Catch(HttpException)
export default class CatchFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const catchResponse = {
      success: false,
      statusCode: exception.status || 500,
      message: "Internal server error",
      timestamp: new Date().toISOString()
    }

    catchResponse.message = exception.response
      ? exception.response.message
      : exception.message;

    response
    .status(catchResponse.statusCode)
    .json(catchResponse);
  }
}
