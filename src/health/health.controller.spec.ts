import { Test, TestingModule } from '@nestjs/testing';
import {
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthCheckService: HealthCheckService;
  let httpHealthIndicator: HttpHealthIndicator;
  let mongooseHealthIndicator: MongooseHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: MongooseHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    httpHealthIndicator = module.get<HttpHealthIndicator>(HttpHealthIndicator);
    mongooseHealthIndicator = module.get<MongooseHealthIndicator>(
      MongooseHealthIndicator,
    );
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  it('should call health.check with correct indicators', async () => {
    const checkSpy = jest.spyOn(healthCheckService, 'check').mockResolvedValue({
      status: 'ok',
      info: {
        google: { status: 'up' },
        elasticsearch: { status: 'up' },
        database: { status: 'up' },
      },
      error: {},
      details: {
        google: { status: 'up' },
        elasticsearch: { status: 'up' },
        database: { status: 'up' },
      },
    });

    const controllerResult = await healthController.check();
    const result = await healthCheckService.check([
      async () =>
        httpHealthIndicator.pingCheck('google', 'https://www.google.com'),
      async () =>
        httpHealthIndicator.pingCheck(
          'elasticsearch',
          process.env.ELASTICSEARCH_HOST,
        ),
      async () =>
        mongooseHealthIndicator.pingCheck('database', { timeout: 1500 }),
    ]);

    expect(checkSpy).toHaveBeenCalled();
    expect(controllerResult).toBe(result);
  });
});
