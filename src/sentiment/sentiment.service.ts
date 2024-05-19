import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sentiment } from './schemas/sentiment.schema';
import { LanguageServiceClient } from '@google-cloud/language';
import { SentimentResponseDto } from './dto/sentimentResponse.dto';

@Injectable()
export class SentimentService {
  private readonly logger = new Logger(SentimentService.name);
  private readonly LanguageServiceClient = new LanguageServiceClient();

  constructor(
    @InjectModel(Sentiment.name) private sentimentModel: Model<any>,
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
      console.log('---------------', newSentiment);

      newSentiment.save();

      const response: SentimentResponseDto = {
        text,
        score: analysisResult.score,
        magnitude: analysisResult.magnitude,
      };

      return response;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error analyzing text');
    }
  }
}
