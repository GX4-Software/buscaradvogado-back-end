import { Controller, Get } from '@nestjs/common';
import { HealthcheckService } from './healthcheck.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('healthcheck')
export class HealthcheckController {
  constructor(private readonly healthcheckService: HealthcheckService) {}

  @Get()
  @ApiOperation({ summary: 'Healthcheck' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async healthcheck() {
    return this.healthcheckService.healthcheck();
  }
}
