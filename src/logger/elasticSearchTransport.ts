import { TransportStreamOptions } from 'winston-transport';
import { Client } from '@elastic/elasticsearch';
import TransportStream = require('winston-transport');

interface ElasticSearchTransportOptions extends TransportStreamOptions {
  elasticsearchHost: string;
}

class ElasticSearchTransport extends TransportStream {
  client: Client;

  constructor(opts?: ElasticSearchTransportOptions) {
    super(opts);
    this.client = new Client({ node: opts.elasticsearchHost });
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    try {
      await this.client.index({
        index: 'sentiment-logs',
        body: {
          '@timestamp': new Date(),
          level: info.level,
          message: info.message,
          service: 'sentiment-analysis',
          environment: process.env.NODE_ENV,
          requestID: info.requestID,
          userID: info.userID,
          errorStack: info.error ? info.error.stack : null,
        },
      });
    } catch (error) {
      this.emit('error', error);
    }

    callback();

    return true;
  }
}

export default ElasticSearchTransport;
