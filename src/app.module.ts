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

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Sentiment.name, schema: SentimentSchema },
    ]),
  ],
  controllers: [AppController, SentimentController],
  providers: [
    AppService,
    SentimentService,
    {
      provide: 'Logger',
      useValue: Logger,
    },
  ],
})
export class AppModule {}
