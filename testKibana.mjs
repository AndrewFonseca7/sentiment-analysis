import { Client } from '@elastic/elasticsearch';
const client = new Client({ node: 'http://localhost:9200' });

async function run() {
  try {
    const health = await client.cluster.health();
    console.log('Elasticsearch cluster health:', health);
  } catch (error) {
    console.error('Error connecting to Elasticsearch:', error);
  }
}

run();
