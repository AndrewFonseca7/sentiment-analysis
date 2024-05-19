import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('status')
  async getStatus(): Promise<any> {
    return await this.appService.getStatus();
  }

  @Get('send-log')
  async sendLog(): Promise<string> {
    return await this.appService.sendLog();
  }
}
