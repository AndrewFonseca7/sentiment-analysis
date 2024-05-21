import { Module } from '@nestjs/common';
import { CacheController } from './cache.controller';
import { CacheModule } from '@nestjs/cache-manager';
import Logger from '../logger/logger';

@Module({
  imports: [CacheModule.register()],
  controllers: [CacheController],
  providers: [
    {
      provide: 'Logger',
      useValue: Logger,
    },
  ],
})
export class AppCacheModule {}
