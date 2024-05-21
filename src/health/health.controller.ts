import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongoose: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Health check',
    description: 'Check the health of the application',
  })
  @ApiResponse({
    status: 200,
    description: 'The health of the application',
  })
  check() {
    return this.health.check([
      async () => this.http.pingCheck('google', 'https://www.google.com'),
      async () => this.mongoose.pingCheck('database', { timeout: 1500 }),
      async () =>
        this.http.pingCheck('elasticsearch', process.env.ELASTICSEARCH_HOST),
    ]);
  }
}
