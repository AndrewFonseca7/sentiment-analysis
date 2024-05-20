import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SentimentService } from './sentiment/sentiment.service';
import { SentimentController } from './sentiment/sentiment.controller';
import {
  SentimentSchema,
  Sentiment,
} from './sentiment/schemas/sentiment.schema';
import { DatabaseModule } from './database/database.module';
import Logger from './logger/logger';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { GoogleSentimentService } from './google-sentiment/google-sentiment.service';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Sentiment.name, schema: SentimentSchema },
    ]),
    CacheModule.registerAsync({
      useFactory: (): CacheModuleOptions => ({
        store: redisStore,
        host: 'localhost', // dirección del servidor Redis
        port: 6379, // puerto del servidor Redis
      }),
    }),
  ],
  controllers: [AppController, SentimentController],
  providers: [
    AppService,
    SentimentService,
    {
      provide: 'Logger',
      useValue: Logger,
    },
    GoogleSentimentService,
  ],
})
export class AppModule {}
