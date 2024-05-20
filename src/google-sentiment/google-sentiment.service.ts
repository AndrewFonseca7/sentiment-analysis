import { Inject, Injectable } from '@nestjs/common';
import { LanguageServiceClient } from '@google-cloud/language';
import { Logger } from 'winston';

@Injectable()
export class GoogleSentimentService {
  private readonly LanguageServiceClient = new LanguageServiceClient();

  constructor(@Inject('Logger') private readonly logger: Logger) {}
  async analyzeSentiment(text: string): Promise<any> {
    try {
      const [result] = await this.LanguageServiceClient.analyzeSentiment({
        document: { content: text, type: 'PLAIN_TEXT', language: 'en' },
      });

      this.logger.info(
        `${GoogleSentimentService.name} | GOOGLE API | ${JSON.stringify(result)}`,
      );
      const analysisResult = result.documentSentiment;

      return {
        text,
        score: analysisResult.score,
        magnitude: analysisResult.magnitude,
      };
    } catch (error) {
      this.logger.error(
        `${GoogleSentimentService.name} | ERROR | Error analyzing text: ${error}`,
      );
      throw new Error('Error analyzing text');
    }
  }
}
