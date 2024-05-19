import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sentiment } from './schemas/sentiment.schema';
import { LanguageServiceClient } from '@google-cloud/language';
import { SentimentResponseDto } from './dto/sentimentResponse.dto';
import { Logger } from 'winston';

@Injectable()
export class SentimentService {
  private readonly LanguageServiceClient = new LanguageServiceClient();

  constructor(
    @InjectModel(Sentiment.name) private sentimentModel: Model<any>,
    @Inject('Logger') private readonly logger: Logger,
  ) {}

  async analyzeText(text: string): Promise<SentimentResponseDto> {
    try {
      const [result] = await this.LanguageServiceClient.analyzeSentiment({
        document: { content: text, type: 'PLAIN_TEXT', language: 'en' },
      });

      const analysisResult = result.documentSentiment;

      const newSentiment = new this.sentimentModel({
        text,
        score: analysisResult.score,
        magnitude: analysisResult.magnitude,
      });
      newSentiment.save();

      const sentimentResponseDto: SentimentResponseDto = {
        text,
        score: analysisResult.score,
        magnitude: analysisResult.magnitude,
      };

      this.logger.error(
        `${SentimentService.name} Text analyzed: ${sentimentResponseDto}`,
      );

      return sentimentResponseDto;
    } catch (error) {
      this.logger.error(
        `${SentimentService.name} Error analyzing text: ${error}`,
      );
      throw new Error('Error analyzing text');
    }
  }
}
