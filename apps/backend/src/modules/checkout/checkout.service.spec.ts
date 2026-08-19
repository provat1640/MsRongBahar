import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutService } from './checkout.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { PaymentMethodEnum } from './checkout.dto';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let redisService: RedisService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            product: { findUnique: jest.fn() },
            productVariant: { findUnique: jest.fn() },
          },
        },
        {
          provide: RedisService,
          useValue: {
            acquireLock: jest.fn().mockResolvedValue('test-lock-token'),
            releaseLock: jest.fn().mockResolvedValue(true),
            reserveStock: jest.fn().mockResolvedValue(true),
            deleteCart: jest.fn().mockResolvedValue(undefined),
            del: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
    redisService = module.get<RedisService>(RedisService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should calculate local Pakundia delivery fee as 40 BDT with express van delivery', () => {
    const feeInfo = service.calculateDeliveryFee({
      district: 'Kishoreganj',
      thana: 'Pakundia',
    });
    expect(feeInfo.fee).toBe(40);
    expect(feeInfo.estimatedDelivery).toContain('Express');
  });

  it('should calculate Kishoreganj district delivery fee as 60 BDT', () => {
    const feeInfo = service.calculateDeliveryFee({
      district: 'Kishoreganj',
      thana: 'Katiadi',
    });
    expect(feeInfo.fee).toBe(60);
  });

  it('should calculate Nationwide delivery fee as 130 BDT', () => {
    const feeInfo = service.calculateDeliveryFee({
      district: 'Chittagong',
      thana: 'Panchlaish',
    });
    expect(feeInfo.fee).toBe(130);
  });
});
