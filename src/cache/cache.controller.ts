import { Controller, Delete, HttpCode, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'winston';

@ApiTags('Cache')
@Controller('cache')
export class CacheController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @Inject('Logger') private readonly logger: Logger,
  ) {}

  @Delete()
  @ApiOperation({
    summary: 'Clear the cache',
    description: 'Clear all the cache of the application',
  })
  @ApiResponse({ status: 204, description: 'Cache cleared' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @HttpCode(204)
  async clearAllCache() {
    await this.cacheService.reset();
    this.logger.info(
      `${CacheController.name} | DELETE | CACHE | Cleared all cache`,
    );
  }
}
