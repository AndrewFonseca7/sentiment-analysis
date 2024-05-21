import { Test, TestingModule } from '@nestjs/testing';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { SentimentRequestDto } from './dto/sentimentRequest.dto';
import { SentimentResponseDto } from './dto/sentimentResponse.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('SentimentController', () => {
  let controller: SentimentController;
  let service: SentimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentimentController],
      providers: [
        {
          provide: SentimentService,
          useValue: {
            analyzeText: jest.fn(),
          },
        },
        {
          provide: 'Logger',
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SentimentController>(SentimentController);
    service = module.get<SentimentService>(SentimentService);
  });

  describe('analyzeSentiment', () => {
    it('should analyze sentiment of a text', async () => {
      const analyzeSentimentDto: SentimentRequestDto = {
        text: 'I got a feeling we are gonna win Our bodies make it perfect And your eyes can make me swim',
      };
      const sentimentResponse: SentimentResponseDto = {
        text: analyzeSentimentDto.text,
        score: 0.8,
        magnitude: 0.9,
      };
      jest.spyOn(service, 'analyzeText').mockResolvedValue(sentimentResponse);

      const result = await controller.analyzeSentiment(analyzeSentimentDto);

      expect(service.analyzeText).toHaveBeenCalledWith(
        analyzeSentimentDto.text,
      );
      expect(result).toEqual(sentimentResponse);
    });

    it('should throw an error if there is an error analyzing the text', async () => {
      const analyzeSentimentDto: SentimentRequestDto = {
        text: 'I got a feeling we are gonna win Our bodies make it perfect And your eyes can make me swim',
      };
      jest
        .spyOn(service, 'analyzeText')
        .mockRejectedValue(new Error('An error occurred'));

      await expect(
        controller.analyzeSentiment(analyzeSentimentDto),
      ).rejects.toThrowError(
        new HttpException(
          'Error analyzing text',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
