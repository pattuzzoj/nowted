import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import type { Response } from "express";

@Catch(HttpException)
export default class CatchFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const catchResponse = {
      status: "error",
      statusCode: 500,
      message: "Internal server error",
      timestamp: new Date().toISOString()
    }

    if (exception instanceof HttpException) {
      catchResponse.statusCode = exception.getStatus();
    }

    catchResponse.message = exception.message;

    response.status(catchResponse.statusCode).json(catchResponse);
  }
}