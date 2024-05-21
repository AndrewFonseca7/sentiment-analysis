import { Test, TestingModule } from '@nestjs/testing';
import { GoogleSentimentService } from './google-sentiment.service';

describe('GoogleSentimentService', () => {
  let service: GoogleSentimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleSentimentService,
        {
          provide: 'Logger',
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GoogleSentimentService>(GoogleSentimentService);
  });

  it('should analyze sentiment of text', async () => {
    // Arrange
    const text = 'This is a test text';
    jest
      .spyOn(service['LanguageServiceClient'], 'analyzeSentiment')
      .mockImplementation(() => {
        return [
          {
            documentSentiment: {
              score: 0.8,
              magnitude: 0.9,
            },
          },
        ];
      });

    // Act
    const result = await service.analyzeSentiment(text);

    // Assert
    expect(result).toBeDefined();
    expect(result.text).toBe(text);
    expect(result.score).toBeDefined();
    expect(result.magnitude).toBeDefined();
  });

  it('should throw an error if text analysis fails', async () => {
    // Arrange
    const text = 'This is a test text';
    jest
      .spyOn(service['LanguageServiceClient'], 'analyzeSentiment')
      .mockImplementation(() => {
        throw new Error('Error analyzing text');
      });

    // Act and Assert
    await expect(service.analyzeSentiment(text)).rejects.toThrow(
      'Error analyzing text',
    );
  });
});
