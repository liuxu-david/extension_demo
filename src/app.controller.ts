import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService){
    console.log(this.configService);
  }

  @Get()
  getHello(): string {
    return "Hello World！！！";
  }
}
