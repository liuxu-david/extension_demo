import { Module } from '@nestjs/common';
import { EzService } from './server.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [EzService],
})
export class EzModule {}
