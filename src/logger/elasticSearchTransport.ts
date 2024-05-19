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

  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    this.client
      .index({
        index: 'sentiment-logs',
        body: {
          message: info.message,
          severity: info.level,
          text: info.message,
          service: 'sentiment-analysis',
        },
      })
      .then(() => {
        callback();
      })
      .catch((error) => {
        this.emit('error', error);
      });

    return true;
  }
}

export default ElasticSearchTransport;
