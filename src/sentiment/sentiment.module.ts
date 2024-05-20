import { Module } from '@nestjs/common';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [SentimentController],
  providers: [SentimentService],
})
export class SentimentModule {}
