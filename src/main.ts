import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { httpExceptionFilter } from './utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 添加一场请求过滤器
  app.useGlobalFilters(new httpExceptionFilter())

  // 添加接口文档配置
  const options = new DocumentBuilder()
    .setTitle('项目名称')
    .setDescription('文档描述')
    .setVersion('版本号')
    .addTag('文档标签')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = app.get(ConfigService).get('SERVER_PORT');
  await app.listen(port);
}
bootstrap();
