import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getHealthStatus() {
    const isDbHealthy = await this.prisma.isHealthy();
    const isRedisHealthy = await this.redis.isHealthy();

    return {
      status: isDbHealthy ? 'ok' : 'degraded',
      service: 'M/S Rong Bahar E-Commerce Backend API',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'production',
      database: isDbHealthy ? 'connected' : 'disconnected',
      cache: {
        mode: this.redis.getMode(),
        healthy: isRedisHealthy,
      },
    };
  }
}
