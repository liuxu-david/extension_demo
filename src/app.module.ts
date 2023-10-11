import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { isDev } from './utils/judge-env';
import devConfig from './config/dev.config';
import prodConfig from './config/prod.config';

@Module({
  imports: [...setupModules()],
  controllers: [AppController],
})
export class AppModule {}

function setupModules(){
  const _configModule = ConfigModule.forRoot({
    isGlobal: true,
    load: [isDev() ? devConfig : prodConfig]
  });

  return [_configModule]
}