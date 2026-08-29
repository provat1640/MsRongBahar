import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('System Health & Deployment Checks')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Public health status check for Render, Vercel, and keep-alive pingers' })
  @ApiResponse({ status: 200, description: 'Service is active and healthy' })
  async getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get('ping')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ultra-lightweight ping route' })
  async ping() {
    return { status: 'pong', timestamp: Date.now() };
  }
}
