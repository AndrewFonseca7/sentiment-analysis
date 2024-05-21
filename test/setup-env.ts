import { config as dotEnvConfig } from 'dotenv';
console.log('Loading .env.test environment variables');
dotEnvConfig({ path: '.env.test' });
