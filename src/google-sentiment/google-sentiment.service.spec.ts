import { Test, TestingModule } from '@nestjs/testing';
import { GoogleSentimentService } from './google-sentiment.service';

describe('GoogleSentimentService', () => {
  let service: GoogleSentimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleSentimentService],
    }).compile();

    service = module.get<GoogleSentimentService>(GoogleSentimentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
