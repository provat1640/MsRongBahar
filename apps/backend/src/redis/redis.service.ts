import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private ioRedisClient: Redis | null = null;
  private upstashRestUrl: string | null = null;
  private upstashRestToken: string | null = null;
  private inMemoryFallback: Map<string, { value: string; expiresAt: number }> = new Map();
  private mode: 'upstash-rest' | 'ioredis' | 'in-memory' = 'in-memory';

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.upstashRestUrl =
      this.configService.get<string>('UPSTASH_REDIS_REST_URL') ||
      this.configService.get<string>('REDIS_REST_URL') ||
      null;
    this.upstashRestToken =
      this.configService.get<string>('UPSTASH_REDIS_REST_TOKEN') ||
      this.configService.get<string>('REDIS_REST_TOKEN') ||
      null;

    // Strategy 1: Upstash Serverless REST Client (No raw TCP sockets required)
    if (this.upstashRestUrl && this.upstashRestToken) {
      this.mode = 'upstash-rest';
      this.logger.log('⚡ Connected to Upstash Redis via Serverless REST API (100% Free & Socketless).');
      return;
    }

    // Strategy 2: Standard ioredis Client (Supports Upstash rediss:// and local redis://)
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (redisUrl && redisUrl !== 'in-memory' && redisUrl !== 'none') {
      try {
        const isTls = redisUrl.startsWith('rediss://');
        this.ioRedisClient = new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          tls: isTls ? { rejectUnauthorized: false } : undefined,
          connectTimeout: 5000,
          lazyConnect: true,
          retryStrategy: (times) => {
            if (times > 3) {
              this.logger.warn('Redis connection retry limit reached. Switched to resilient in-memory cache.');
              return null;
            }
            return Math.min(times * 200, 2000);
          },
        });

        this.ioRedisClient.on('connect', () => {
          this.mode = 'ioredis';
          this.logger.log(`⚡ Connected to Redis instance via TCP (${isTls ? 'TLS Encrypted' : 'Standard'})`);
        });

        this.ioRedisClient.on('error', (err) => {
          this.logger.warn(`Redis connection warning: ${err.message}. Operating in resilient memory mode.`);
        });

        await this.ioRedisClient.connect().catch((e) => {
          this.logger.warn(`Initial Redis TCP connect deferred: ${e.message}`);
        });

        if (this.ioRedisClient.status === 'ready') {
          this.mode = 'ioredis';
          return;
        }
      } catch (err: any) {
        this.logger.warn(`Could not connect to Redis TCP: ${err?.message}. Using in-memory fallback.`);
      }
    }

    // Strategy 3: Resilient In-Memory Fallback
    this.mode = 'in-memory';
    this.logger.log('🧠 Operating in Resilient In-Memory Cache mode (Zero-dependency fallback active).');
  }

  async onModuleDestroy() {
    if (this.ioRedisClient) {
      try {
        await this.ioRedisClient.quit();
      } catch {
        // ignore disconnect errors
      }
    }
  }

  getMode(): string {
    return this.mode;
  }

  // --- UPSTASH REST HELPER ---
  private async executeUpstashRest(command: string[]): Promise<any> {
    if (!this.upstashRestUrl || !this.upstashRestToken) return null;
    const url = `${this.upstashRestUrl.replace(/\/$/, '')}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.upstashRestToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) throw new Error(`Upstash REST status ${res.status}`);
    const data = await res.json();
    return data.result;
  }

  async isHealthy(): Promise<boolean> {
    if (this.mode === 'upstash-rest') {
      try {
        const pingRes = await this.executeUpstashRest(['PING']);
        return pingRes === 'PONG';
      } catch {
        return false;
      }
    }
    if (this.mode === 'ioredis' && this.ioRedisClient && this.ioRedisClient.status === 'ready') {
      try {
        await this.ioRedisClient.ping();
        return true;
      } catch {
        return false;
      }
    }
    return true; // in-memory fallback is always healthy
  }

  // --- GENERAL KEY-VALUE OPERATIONS ---
  async get<T>(key: string): Promise<T | null> {
    // 1. Upstash REST
    if (this.mode === 'upstash-rest') {
      try {
        const data = await this.executeUpstashRest(['GET', key]);
        if (!data) return null;
        if (typeof data === 'string') {
          try {
            return JSON.parse(data);
          } catch {
            return data as unknown as T;
          }
        }
        return data as T;
      } catch (e: any) {
        this.logger.warn(`Upstash REST get error for ${key}: ${e.message}`);
      }
    }

    // 2. ioredis TCP
    if (this.ioRedisClient && this.ioRedisClient.status === 'ready') {
      try {
        const data = await this.ioRedisClient.get(key);
        return data ? JSON.parse(data) : null;
      } catch (e: any) {
        this.logger.warn(`ioredis get error for ${key}: ${e.message}`);
      }
    }

    // 3. In-memory fallback
    const entry = this.inMemoryFallback.get(key);
    if (entry) {
      if (entry.expiresAt > Date.now()) {
        try {
          return JSON.parse(entry.value);
        } catch {
          return entry.value as unknown as T;
        }
      }
      this.inMemoryFallback.delete(key);
    }
    return null;
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);

    // 1. Upstash REST
    if (this.mode === 'upstash-rest') {
      try {
        if (ttlSeconds > 0) {
          await this.executeUpstashRest(['SET', key, serialized, 'EX', String(ttlSeconds)]);
        } else {
          await this.executeUpstashRest(['SET', key, serialized]);
        }
        return;
      } catch (e: any) {
        this.logger.warn(`Upstash REST set error for ${key}: ${e.message}`);
      }
    }

    // 2. ioredis TCP
    if (this.ioRedisClient && this.ioRedisClient.status === 'ready') {
      try {
        if (ttlSeconds > 0) {
          await this.ioRedisClient.set(key, serialized, 'EX', ttlSeconds);
        } else {
          await this.ioRedisClient.set(key, serialized);
        }
        return;
      } catch (e: any) {
        this.logger.warn(`ioredis set error for ${key}: ${e.message}`);
      }
    }

    // 3. In-memory fallback
    this.inMemoryFallback.set(key, {
      value: serialized,
      expiresAt: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : Infinity,
    });
  }

  async del(key: string): Promise<void> {
    if (this.mode === 'upstash-rest') {
      try {
        await this.executeUpstashRest(['DEL', key]);
        return;
      } catch (e: any) {
        this.logger.warn(`Upstash REST del error for ${key}: ${e.message}`);
      }
    }

    if (this.ioRedisClient && this.ioRedisClient.status === 'ready') {
      try {
        await this.ioRedisClient.del(key);
        return;
      } catch (e: any) {
        this.logger.warn(`ioredis del error for ${key}: ${e.message}`);
      }
    }

    this.inMemoryFallback.delete(key);
  }

  // --- DISTRIBUTED LOCK FOR INVENTORY & CONCURRENCY ---
  async acquireLock(resourceKey: string, ttlMs: number = 5000): Promise<string | null> {
    const lockToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const lockKey = `lock:${resourceKey}`;

    // 1. Upstash REST
    if (this.mode === 'upstash-rest') {
      try {
        const result = await this.executeUpstashRest(['SET', lockKey, lockToken, 'PX', String(ttlMs), 'NX']);
        if (result === 'OK' || result === 1) {
          return lockToken;
        }
        return null;
      } catch (e: any) {
        this.logger.warn(`Upstash REST acquireLock error for ${resourceKey}: ${e.message}`);
      }
    }

    // 2. ioredis TCP
    if (this.ioRedisClient && this.ioRedisClient.status === 'ready') {
      try {
        const result = await this.ioRedisClient.set(lockKey, lockToken, 'PX', ttlMs, 'NX');
        if (result === 'OK') {
          return lockToken;
        }
        return null;
      } catch (e: any) {
        this.logger.warn(`ioredis acquireLock error for ${resourceKey}: ${e.message}`);
      }
    }

    // 3. Memory fallback lock
    const current = this.inMemoryFallback.get(lockKey);
    if (!current || current.expiresAt <= Date.now()) {
      this.inMemoryFallback.set(lockKey, {
        value: lockToken,
        expiresAt: Date.now() + ttlMs,
      });
      return lockToken;
    }
    return null;
  }

  async releaseLock(resourceKey: string, lockToken: string): Promise<boolean> {
    const lockKey = `lock:${resourceKey}`;

    // 1. Upstash REST
    if (this.mode === 'upstash-rest') {
      try {
        const current = await this.executeUpstashRest(['GET', lockKey]);
        if (current === lockToken) {
          await this.executeUpstashRest(['DEL', lockKey]);
          return true;
        }
        return false;
      } catch (e: any) {
        this.logger.warn(`Upstash REST releaseLock error for ${resourceKey}: ${e.message}`);
      }
    }

    // 2. ioredis TCP
    if (this.ioRedisClient && this.ioRedisClient.status === 'ready') {
      try {
        const luaScript = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
          else
            return 0
          end
        `;
        const result = await this.ioRedisClient.eval(luaScript, 1, lockKey, lockToken);
        return result === 1;
      } catch (e: any) {
        this.logger.warn(`ioredis releaseLock error for ${resourceKey}: ${e.message}`);
      }
    }

    // 3. Memory fallback release
    const current = this.inMemoryFallback.get(lockKey);
    if (current && current.value === lockToken) {
      this.inMemoryFallback.delete(lockKey);
      return true;
    }
    return false;
  }

  // --- TEMPORARY INVENTORY RESERVATION (10 MIN HOLD) ---
  async reserveStock(variantOrProductId: string, orderSessionId: string, quantity: number, ttlSeconds: number = 600): Promise<boolean> {
    const reservationKey = `reservation:${variantOrProductId}:${orderSessionId}`;
    await this.set(reservationKey, { quantity, reservedAt: Date.now() }, ttlSeconds);
    return true;
  }

  async releaseReservation(variantOrProductId: string, orderSessionId: string): Promise<void> {
    const reservationKey = `reservation:${variantOrProductId}:${orderSessionId}`;
    await this.del(reservationKey);
  }

  // --- CART CACHING ---
  async getCart(cartId: string): Promise<any | null> {
    return this.get(`cart:${cartId}`);
  }

  async setCart(cartId: string, cartData: any, ttlSeconds: number = 604800): Promise<void> {
    await this.set(`cart:${cartId}`, cartData, ttlSeconds);
  }

  async deleteCart(cartId: string): Promise<void> {
    await this.del(`cart:${cartId}`);
  }
}
