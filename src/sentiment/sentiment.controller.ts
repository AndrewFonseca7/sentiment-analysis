import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SentimentRequestDto } from './dto/sentimentRequest.dto';
import { SentimentResponseDto } from './dto/sentimentResponse.dto';
import { Logger } from 'winston';

@ApiTags('Sentiment')
@Controller('sentiment')
export class SentimentController {
  constructor(
    private readonly sentimentService: SentimentService,
    @Inject('Logger') private readonly logger: Logger,
  ) {}

  @Post('analyze')
  @ApiOperation({
    summary: 'Analyze sentiment of a text',
    description:
      'Analyze the sentiment of a text returning a score and magnitude of the sentiment analysis. The score of the sentiment ranges from -1.0 (negative) to 1.0 (positive) and the magnitude of the sentiment ranges from 0.0 to +inf. The score represents the emotional leaning of the text and the magnitude represents the strength of the emotion.',
  })
  @ApiBody({
    schema: { type: 'object', properties: { text: { type: 'string' } } },
    description: 'Text to analyze',
    required: true,
    examples: {
      example: {
        value: {
          text: 'I got a feeling we are gonna win Our bodies make it perfect And your eyes can make me swim',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The sentiment analysis of the text',
    type: SentimentResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe())
  async analyzeSentiment(
    @Body() analyzeSentimentDto: SentimentRequestDto,
  ): Promise<SentimentResponseDto> {
    try {
      this.logger.info(
        `${SentimentController.name} | POST | ANALYZE | ${JSON.stringify(analyzeSentimentDto)}`,
      );
      return await this.sentimentService.analyzeText(analyzeSentimentDto.text);
    } catch (error) {
      throw new HttpException(
        'Error analyzing text',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
