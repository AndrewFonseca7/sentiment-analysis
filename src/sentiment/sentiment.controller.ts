import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { Sentiment } from './schemas/sentiment.schema';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SentimentRequestDto } from './dto/sentimentRequest.dto';
import { SentimentResponseDto } from './dto/sentimentResponse.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Sentiment')
@Controller('sentiment')
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) {}

  @CacheTTL(30)
  @UseInterceptors(CacheInterceptor)
  @Post()
  @ApiOperation({
    summary: 'Analyze sentiment of a text',
    description:
      'Analyze the sentiment of a text returning a score and magnitude of the sentiment analysis. The score of the sentiment ranges from -1.0 (negative) to 1.0 (positive) and the magnitude of the sentiment ranges from 0.0 to +inf. The score represents the emotional leaning of the text and the magnitude represents the strength of the emotion.',
  })
  @ApiBody({
    schema: { type: 'object', properties: { text: { type: 'string' } } },
    description: 'Text to analyze',
  })
  @ApiResponse({
    status: 200,
    description: 'The sentiment analysis of the text',
    type: Sentiment,
    schema: {
      example: { text: 'I love this product', score: 0.9, magnitude: 0.9 },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe())
  async analyzeSentiment(
    @Body() analyzeSentimentDto: SentimentRequestDto,
  ): Promise<SentimentResponseDto> {
    try {
      return await this.sentimentService.analyzeText(analyzeSentimentDto.text);
    } catch (error) {
      throw new HttpException(
        'Error analyzing text',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
