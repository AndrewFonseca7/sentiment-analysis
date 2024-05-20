import { Module } from '@nestjs/common';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { GoogleSentimentService } from 'src/google-sentiment/google-sentiment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sentiment, SentimentSchema } from './schemas/sentiment.schema';
import Logger from 'src/logger/logger';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sentiment.name, schema: SentimentSchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [SentimentController],
  providers: [
    SentimentService,
    GoogleSentimentService,
    {
      provide: 'Logger',
      useValue: Logger,
    },
  ],
})
export class SentimentModule {}
