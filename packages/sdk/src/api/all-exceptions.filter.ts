import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { GenericErrorResponse } from './dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status, message: string;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response: any = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response.error && typeof response.error === 'string') {
        message = response.error;
      } else if (typeof response === 'object' && response.error.message) {
        message = response.error.message;
      } else {
        message = 'Unknown error';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = (exception as Error).message;
    }

    const errorObject: GenericErrorResponse = {
      status: 'error',
      error: {
        message: message.toString(),
      },
    };
    console.error(JSON.stringify({ type: 'all-exceptions-filter', message }));
    response.status(status).json(errorObject);
  }
}
