import { Module } from '@nestjs/common';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { CacheModule } from '@nestjs/cache-manager';
import { GoogleSentimentService } from 'src/google-sentiment/google-sentiment.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [SentimentController],
  providers: [SentimentService, GoogleSentimentService],
})
export class SentimentModule {}
