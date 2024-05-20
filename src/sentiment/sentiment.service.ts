import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sentiment } from './schemas/sentiment.schema';
import { SentimentResponseDto } from './dto/sentimentResponse.dto';
import { Logger } from 'winston';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GoogleSentimentService } from 'src/google-sentiment/google-sentiment.service';

@Injectable()
export class SentimentService {
  constructor(
    @InjectModel(Sentiment.name) private sentimentModel: Model<any>,
    @Inject('Logger') private readonly logger: Logger,
    private readonly googleSentimentService: GoogleSentimentService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async analyzeText(text: string): Promise<SentimentResponseDto> {
    // Create a cache key
    const cacheKey = `sentiment:${text}`;

    // 1 - Check if the data is in the cache
    const cacheResult = await this.getFromCache(cacheKey);
    if (cacheResult) {
      this.logger.info(
        `${SentimentService.name} | CACHE | ${JSON.stringify({ ...cacheResult, text })}`,
      );
      return {
        magnitude: cacheResult.magnitude,
        score: cacheResult.score,
        text,
      };
    }

    // 2 - Check if the data is in the database
    const dbResult = await this.getFromDatabase(text);

    if (dbResult) {
      this.logger.info(
        `${SentimentService.name} | DATABASE | ${JSON.stringify({ magnitude: dbResult.magnitude, score: dbResult.score, text })}`,
      );
      this.cacheResult(cacheKey, dbResult.magnitude, dbResult.score);
      return { magnitude: dbResult.magnitude, score: dbResult.score, text };
    }

    // 3 - If the data is not in the cache or the database, analyze the text

    const sentiment = await this.googleSentimentService.analyzeSentiment(text);
    this.cacheResult(cacheKey, sentiment.magnitude, sentiment.score);
    this.saveToDatabase(text, sentiment.score, sentiment.magnitude);
    this.logger.info(
      `${SentimentService.name} | API | ${JSON.stringify(sentiment)}`,
    );
    return sentiment;
  }

  private async getFromCache(
    cacheKey: string,
  ): Promise<{ magnitude: number; score: number } | null> {
    return await this.cacheService.get<{ magnitude: number; score: number }>(
      cacheKey,
    );
  }

  private async cacheResult(
    cacheKey: string,
    magnitude: number,
    score: number,
  ): Promise<void> {
    await this.cacheService.set(cacheKey, { magnitude, score });
  }

  private async getFromDatabase(text: string): Promise<SentimentResponseDto> {
    const dbResult = await this.sentimentModel.findOne({
      text,
    });
    if (dbResult) {
      return { magnitude: dbResult.magnitude, score: dbResult.score, text };
    }

    return null;
  }

  private async saveToDatabase(
    text: string,
    score: number,
    magnitude: number,
  ): Promise<void> {
    const sentiment = new this.sentimentModel({
      text,
      score,
      magnitude,
    });
    sentiment.save();
  }
}
