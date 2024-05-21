import { Test, TestingModule } from '@nestjs/testing';
import { CacheController } from './cache.controller';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Logger } from 'winston';

describe('CacheController', () => {
  let controller: CacheController;
  let cacheService: Cache;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CacheController],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: {
            reset: jest.fn(),
          },
        },
        {
          provide: 'Logger',
          useValue: {
            info: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CacheController>(CacheController);
    cacheService = module.get<Cache>(CACHE_MANAGER);
    logger = module.get<Logger>('Logger');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('clearAllCache', () => {
    it('should clear the cache and log the action', async () => {
      // Arrange
      const resetSpy = jest.spyOn(cacheService, 'reset');
      const loggerSpy = jest.spyOn(logger, 'info');

      // Act
      await controller.clearAllCache();

      // Assert
      expect(resetSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `${CacheController.name} | DELETE | CACHE | Cleared all cache`,
      );
    });
  });
});
