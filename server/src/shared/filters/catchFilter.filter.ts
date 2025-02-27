// @ts-nocheck

import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import type { Response } from "express";

@Catch(HttpException)
export default class CatchFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const catchResponse = {
      status: "error",
      statusCode: 500,
      message: "Internal server error",
      timestamp: new Date().toISOString()
    }

    if (exception.response) {
      catchResponse.message = exception.response.message;
    } else {
      catchResponse.message = exception.message;
    }

    catchResponse.statusCode = exception.status;

    console.error(exception);

    response.status(catchResponse.statusCode).json(catchResponse);
  }
}