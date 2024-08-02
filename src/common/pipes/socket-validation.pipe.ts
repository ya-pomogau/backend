import { Injectable, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';

@Injectable()
export class SocketValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      exceptionFactory: (errors: ValidationError[]): WsException => {
        if (this.isDetailedOutputDisabled) {
          return new WsException({
            message: 'Bad request',
          });
        }
        // eslint-disable-next-line no-console
        console.log('validationErrors:', errors);
        return new WsException(errors);
      },
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      ...options,
    });
  }
}
