import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class AppService {
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  getHello(): string {
    this.logger.info('Hello ReflexAI, nice to meet you!!');
    return 'Hello ReflexAI, nice to meet you!!';
  }

  async getStatus(): Promise<any> {
    const client = new Client({ node: 'http://localhost:9200' });
    try {
      const health = await client.cluster.health();
      console.log('Elasticsearch cluster health:', health);
      return JSON.stringify(health);
    } catch (error) {
      console.error('Error connecting to Elasticsearch:', error);
      return error;
    }
  }

  async sendLog(): Promise<string> {
    const client = new Client({ node: 'http://localhost:9200' });
    try {
      await client.index({
        index: 'sentiment-logs-test',
        body: {
          test: 'Test log message 2',
          service: 'sentiment-analysis',
        },
      });

      return 'Log sent';
    } catch (error) {
      this.logger.error('test error', { name: 'test' }, error);
      return 'Error sending log';
    }
  }
}
