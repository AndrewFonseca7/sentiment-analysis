import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import Logger from './logger/logger';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { GoogleSentimentService } from './google-sentiment/google-sentiment.service';
import { AppCacheModule } from './cache/cache.module';
import * as redisStore from 'cache-manager-ioredis';
import { CacheController } from './cache/cache.controller';
import { SentimentModule } from './sentiment/sentiment.module';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.registerAsync({
      useFactory: (): CacheModuleOptions => ({
        store: redisStore,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      }),
    }),
    SentimentModule,
    AppCacheModule,
  ],
  controllers: [AppController, CacheController],
  providers: [
    AppService,
    {
      provide: 'Logger',
      useValue: Logger,
    },
    GoogleSentimentService,
  ],
})
export class AppModule {}
