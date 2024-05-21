import { Module } from '@nestjs/common';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { GoogleSentimentService } from '../google-sentiment/google-sentiment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sentiment, SentimentSchema } from './schemas/sentiment.schema';
import Logger from '../logger/logger';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sentiment.name, schema: SentimentSchema },
    ]),
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
  exports: [SentimentService],
})
export class SentimentModule {}
