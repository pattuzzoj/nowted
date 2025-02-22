import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SetMessage } from "@shared/decorators/setMessage.decorator";
import { map, Observable } from "rxjs";

@Injectable()
export default class FormatResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const message = this.reflector.get(SetMessage, context.getHandler());
    const statusCode = response.statusCode;

    const ApiResponse = {
      status: "success",
      statusCode: statusCode,
      message: message,
      timestamp: new Date().toISOString()
    }

    return next.handle().pipe(
      map(data => ({
        ...ApiResponse,
        data,
      }))
    )
  }
}