import * as winston from 'winston';
import ElasticSearchTransport from './elasticSearchTransport';

const Logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new ElasticSearchTransport({
      elasticsearchHost: process.env.ELASTICSEARCH_HOST,
    }),
  ],
});

Logger.on('error', (err) => {
  console.error('Error in logger:', err);
});

export default Logger;
