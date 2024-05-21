import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SentimentService } from './sentiment.service';
import { Sentiment } from './schemas/sentiment.schema';
import { SentimentResponseDto } from './dto/sentimentResponse.dto';
import { GoogleSentimentService } from '../google-sentiment/google-sentiment.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('SentimentService', () => {
  let sentimentService: SentimentService;
  let sentimentModel: any;
  let googleSentimentService: GoogleSentimentService;
  let cacheService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentimentService,
        {
          provide: getModelToken(Sentiment.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
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
          provide: GoogleSentimentService,
          useValue: {
            analyzeSentiment: jest.fn(),
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

    sentimentService = module.get<SentimentService>(SentimentService);
    sentimentModel = module.get<any>(getModelToken(Sentiment.name));
    googleSentimentService = module.get<GoogleSentimentService>(
      GoogleSentimentService,
    );
    cacheService = module.get<any>(CACHE_MANAGER);
  });

  describe('analyzeText', () => {
    it('should return sentiment from cache if available', async () => {
      const text = 'This is a test text';
      const cacheResult = {
        magnitude: 0.8,
        score: 0.5,
      };

      jest.spyOn(cacheService, 'get').mockResolvedValue(cacheResult);

      const result = await sentimentService.analyzeText(text);

      expect(cacheService.get).toHaveBeenCalledWith(`sentiment:${text}`);
      expect(result).toEqual({
        text,
        magnitude: cacheResult.magnitude,
        score: cacheResult.score,
      });
    });

    it('should return sentiment from database if available', async () => {
      const text = 'This is a test text';
      const dbResult = {
        magnitude: 0.8,
        score: 0.5,
      };

      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(sentimentModel, 'findOne').mockResolvedValue(dbResult);

      const result = await sentimentService.analyzeText(text);

      expect(cacheService.get).toHaveBeenCalledWith(`sentiment:${text}`);
      expect(sentimentModel.findOne).toHaveBeenCalledWith({ text });
      expect(result).toEqual({
        text,
        magnitude: dbResult.magnitude,
        score: dbResult.score,
      });
      expect(cacheService.set).toHaveBeenCalledWith(`sentiment:${text}`, {
        magnitude: dbResult.magnitude,
        score: dbResult.score,
      });
      expect(sentimentModel.save).not.toHaveBeenCalled();
    });

    it.skip('should analyze the text and return the sentiment response', async () => {
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

      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(sentimentModel, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(googleSentimentService, 'analyzeSentiment')
        .mockResolvedValue(analysisResult);
      jest.spyOn(cacheService, 'set').mockResolvedValue(analysisResult);
      jest.spyOn(sentimentModel, 'save').mockResolvedValue({
        text,
        score: analysisResult.score,
        magnitude: analysisResult.magnitude,
      });

      const result = await sentimentService.analyzeText(text);

      expect(cacheService.get).toHaveBeenCalledWith(`sentiment:${text}`);
      expect(sentimentModel.findOne).toHaveBeenCalledWith({ text });
      expect(googleSentimentService.analyzeSentiment).toHaveBeenCalledWith(
        text,
      );
      expect(cacheService.set).toHaveBeenCalledWith(`sentiment:${text}`, {
        magnitude: analysisResult.magnitude,
        score: analysisResult.score,
      });
      expect(sentimentModel.save).toHaveBeenCalledWith({
        text,
        score: analysisResult.score,
        magnitude: analysisResult.magnitude,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if there is an error analyzing the text', async () => {
      const text = 'This is a test text';
      const error = new Error('Error analyzing text');

      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(sentimentModel, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(googleSentimentService, 'analyzeSentiment')
        .mockRejectedValue(error);
      jest.spyOn(sentimentService['logger'], 'error');

      await expect(sentimentService.analyzeText(text)).rejects.toThrow(error);

      expect(cacheService.get).toHaveBeenCalledWith(`sentiment:${text}`);
      expect(sentimentModel.findOne).toHaveBeenCalledWith({ text });
      expect(googleSentimentService.analyzeSentiment).toHaveBeenCalledWith(
        text,
      );
    });
  });
});
