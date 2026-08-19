import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private inMemoryFallback: Map<string, { value: string; expiresAt: number }> = new Map();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn(`Redis connection retry limit reached. Falling back to robust in-memory cache.`);
            return null;
          }
          return Math.min(times * 100, 2000);
        },
      });

      this.client.on('connect', () => {
        this.logger.log(`⚡ Connected to Redis instance at ${redisUrl}`);
      });

      this.client.on('error', (err) => {
        this.logger.warn(`Redis error: ${err.message}. Operating in resilient memory fallback mode.`);
      });
    } catch (err) {
      this.logger.warn(`Could not initialize Redis client. Using in-memory fallback.`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  // --- GENERAL KEY-VALUE OPERATIONS ---
  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.client && this.client.status === 'ready') {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (e) {
      this.logger.warn(`Redis get error for ${key}: ${e.message}`);
    }

    // In-memory fallback check
    const entry = this.inMemoryFallback.get(key);
    if (entry) {
      if (entry.expiresAt > Date.now()) {
        return JSON.parse(entry.value);
      }
      this.inMemoryFallback.delete(key);
    }
    return null;
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    const serialized = JSON.stringify(value);
    try {
      if (this.client && this.client.status === 'ready') {
        if (ttlSeconds > 0) {
          await this.client.set(key, serialized, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, serialized);
        }
        return;
      }
    } catch (e) {
      this.logger.warn(`Redis set error for ${key}: ${e.message}`);
    }

    // In-memory fallback
    this.inMemoryFallback.set(key, {
      value: serialized,
      expiresAt: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : Infinity,
    });
  }

  async del(key: string): Promise<void> {
    try {
      if (this.client && this.client.status === 'ready') {
        await this.client.del(key);
        return;
      }
    } catch (e) {
      this.logger.warn(`Redis del error for ${key}: ${e.message}`);
    }
    this.inMemoryFallback.delete(key);
  }

  // --- DISTRIBUTED LOCK FOR INVENTORY & CONCURRENCY ---
  async acquireLock(resourceKey: string, ttlMs: number = 5000): Promise<string | null> {
    const lockToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const lockKey = `lock:${resourceKey}`;

    try {
      if (this.client && this.client.status === 'ready') {
        // Atomic NX (set if not exists) with PX (millisecond TTL)
        const result = await this.client.set(lockKey, lockToken, 'PX', ttlMs, 'NX');
        if (result === 'OK') {
          return lockToken;
        }
        return null;
      }
    } catch (e) {
      this.logger.warn(`Redis acquireLock error for ${resourceKey}: ${e.message}`);
    }

    // Memory fallback lock
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
    try {
      if (this.client && this.client.status === 'ready') {
        // Lua script to safely release only if token matches
        const luaScript = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
          else
            return 0
          end
        `;
        const result = await this.client.eval(luaScript, 1, lockKey, lockToken);
        return result === 1;
      }
    } catch (e) {
      this.logger.warn(`Redis releaseLock error for ${resourceKey}: ${e.message}`);
    }

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
    // Default 7 days TTL for carts
    await this.set(`cart:${cartId}`, cartData, ttlSeconds);
  }

  async deleteCart(cartId: string): Promise<void> {
    await this.del(`cart:${cartId}`);
  }
}
