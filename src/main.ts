import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
