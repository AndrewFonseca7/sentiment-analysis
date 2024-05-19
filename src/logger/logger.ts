import * as winston from 'winston';
import ElasticSearchTransport from './elasticSearchTransport';

const Logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new ElasticSearchTransport({
      elasticsearchHost: process.env.ELASTICSEARCH_HOST,
    }),
  ],
});

Logger.on('error', (err) => {
  console.error('Error in logger:', err);
});

console.log('Elasticsearch host:', process.env.ELASTICSEARCH_HOST);

export default Logger;
