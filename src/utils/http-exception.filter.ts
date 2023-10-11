import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';


@Catch()
export class httpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const resultMessage = exception.message;
    const errorResponse = {
      status,
      message: resultMessage,
      path: request.url,
      method: request.method,
    };
    // 打印日志
    Logger.log(exception, '错误提示');
    Logger.error(JSON.stringify(errorResponse),  '错误信息');
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}