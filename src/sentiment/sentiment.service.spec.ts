import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SentimentService } from './sentiment.service';
import { Sentiment } from './schemas/sentiment.schema';
import { LanguageServiceClient } from '@google-cloud/language';
import { SentimentResponseDto } from './dto/sentimentResponse.dto';

describe('SentimentService', () => {
  let sentimentService: SentimentService;
  let sentimentModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentimentService,
        {
          provide: 'SentimentModel',
          useValue: {
            new: jest.fn(),
            save: jest.fn(),
            constructor: jest.fn().mockResolvedValue({
              save: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    sentimentService = module.get<SentimentService>(SentimentService);
    sentimentModel = module.get<any>(getModelToken(Sentiment.name));
  });

  describe('analyzeText', () => {
    it('should return mocked value', async () => {
      const mockValue = { text: 'some text', score: 0.8, magnitude: 0.9 };
      const result = new sentimentModel.sentimentModel(mockValue);

      expect(result).toEqual(mockValue);
      await expect(result.save()).resolves.toEqual(mockValue);
    });

    it('should analyze the text and return the sentiment response', async () => {
      const text = 'This is a test text';
      const analysisResult = {
        score: 0.5,
        magnitude: 0.8,
      };
      const expectedResponse: SentimentResponseDto = {
        text,
        score: analysisResult.score,
        magnitude: analysisResult.magnitude,
      };

      jest
        .spyOn(LanguageServiceClient.prototype, 'analyzeSentiment')
        .mockImplementation(() =>
          Promise.resolve([
            {
              documentSentiment: analysisResult,
            },
          ]),
        );

      jest.spyOn(sentimentModel, 'new').mockImplementation(() => {
        return {
          save: jest.fn().mockResolvedValue({
            text,
            score: analysisResult.score,
            magnitude: analysisResult.magnitude,
          }),
        };
      });

      const result = await sentimentService.analyzeText(text);

      expect(
        LanguageServiceClient.prototype.analyzeSentiment,
      ).toHaveBeenCalledWith({
        document: { content: text, type: 'PLAIN_TEXT', language: 'en' },
      });
      expect(sentimentModel.new).toHaveBeenCalledWith({
        text,
        score: analysisResult.score,
        magnitude: analysisResult.magnitude,
      });
      expect(sentimentModel.new().save).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if there is an error analyzing the text', async () => {
      const text = 'This is a test text';
      const error = new Error('Error analyzing text');

      jest
        .spyOn(LanguageServiceClient.prototype, 'analyzeSentiment')
        .mockImplementation(() => Promise.reject(error));

      jest.spyOn(sentimentService['logger'], 'error');

      await expect(sentimentService.analyzeText(text)).rejects.toThrow(error);

      expect(sentimentService['logger'].error).toHaveBeenCalledWith(error);
    });
  });
});
