import { RESPONSE_MESSAGE_METADATA } from '@app/decorators/response-message/response-message.decorator';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
export type Response<T> = {
  status: boolean;
  statusCode: number;
  path: string;
  message: string;
  data: T;
  timestamp: string;
};
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle();
  }
  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode;
    const message =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_METADATA,
        context.getHandler(),
      ) || 'success';

    return {
      status: true,
      path: request.url,
      message: message,
      statusCode,
      data: res,
      timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
    };
  }
}
