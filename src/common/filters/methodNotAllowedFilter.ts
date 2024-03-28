import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  MethodNotAllowedException,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class MethodNotAllowedExceptionFilter implements ExceptionFilter {
  catch(exception: MethodNotAllowedException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.getResponse();

    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const response = ctx.getResponse();

    response.status(status).json({
      error: {
        status,
        message,
        method: request.method,
        url: request.url,
      },
    });
  }
}
