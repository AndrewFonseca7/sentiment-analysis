import { Test, TestingModule } from '@nestjs/testing';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { getModelToken } from '@nestjs/mongoose';

describe('SentimentController', () => {
  let controller: SentimentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentimentController],
      providers: [
        SentimentService,
        {
          provide: getModelToken('Sentiment'),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SentimentController>(SentimentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
