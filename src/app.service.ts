import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello ReflexAI, nice to meet you!';
  }
}
