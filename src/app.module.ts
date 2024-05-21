import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import Logger from './logger/logger';
import { CacheModule } from '@nestjs/cache-manager';
import { AppCacheModule } from './cache/cache.module';
import * as redisStore from 'cache-manager-ioredis';
import { SentimentModule } from './sentiment/sentiment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: configService.get<number>('CACHE_TTL') | 60,
        max: configService.get<number>('CACHE_SIZE') | 1000,
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
    HttpModule,
    TerminusModule,
    AppCacheModule,
    SentimentModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: 'Logger',
      useValue: Logger,
    },
  ],
})
export class AppModule {}
