import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SetMessage } from "@shared/decorators/setMessage.decorator";
import { map, Observable } from "rxjs";

@Injectable()
export default class FormatResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const message = this.reflector.get(SetMessage, context.getHandler());

    return next.handle().pipe(
      map(data => {
        return {
          message,
          ...data
        }
      })
    )
  }
}
