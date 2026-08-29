import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Configure Prisma Client with pooled connection options if applicable
    const dbUrl = process.env.DATABASE_URL;
    let configuredUrl = dbUrl;

    if (dbUrl && !dbUrl.includes('connection_limit') && !dbUrl.startsWith('file:')) {
      const separator = dbUrl.includes('?') ? '&' : '?';
      configuredUrl = `${dbUrl}${separator}connection_limit=5&pool_timeout=15`;
    }

    super({
      datasources: configuredUrl
        ? {
            db: {
              url: configuredUrl,
            },
          }
        : undefined,
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('🐘 PostgreSQL Database connection established (Serverless Pooled Client).');
        break;
      } catch (err: any) {
        retries -= 1;
        this.logger.warn(`Database connection attempt failed (${err?.message || err}). Retries remaining: ${retries}`);
        if (retries === 0) {
          this.logger.error('❌ Could not connect to PostgreSQL. Operating in resilient fallback mode.');
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

