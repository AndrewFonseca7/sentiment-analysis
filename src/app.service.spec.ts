import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'Logger',
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return the correct greeting', () => {
      const result = appService.getHello();
      expect(result).toBe('Hello ReflexAI, nice to meet you!');
    });
  });
});
