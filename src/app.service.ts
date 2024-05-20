import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class AppService {
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  getHello(): string {
    return 'Hello ReflexAI, nice to meet you!';
  }
}
