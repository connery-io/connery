import { Public } from ':src/shared/auth.guard';
import { ObjectResponse } from ':src/shared/api-types';
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tools')
@Controller('/health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @ApiOperation({
    summary: 'Check the health of the runner.',
    description: 'Check the health of the runner.',
  })
  @Public()
  @Get()
  @HealthCheck()
  async check(): Promise<ObjectResponse<undefined>> {
    await this.health.check([]);

    return {
      status: 'success',
      data: undefined,
    };
  }
}
