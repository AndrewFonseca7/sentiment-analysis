import * as winston from 'winston';
import * as Elasticsearch from 'winston-elasticsearch';

const elasticsearchOptions = {
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_HOST || 'http://elasticsearch:9200',
  },
  indexPrefix: 'sentiment-logs',
};

const esTransport = new Elasticsearch.ElasticsearchTransport(
  elasticsearchOptions,
);

const Logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console(), esTransport],
});

Logger.on('error', (err) => {
  console.error('Error in logger:', err);
});

console.log('Elasticsearch host:', process.env.ELASTICSEARCH_HOST);

export default Logger;
