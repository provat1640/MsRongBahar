import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

describe('CartService', () => {
  let service: CartService;
  let redisService: RedisService;
  let prismaService: PrismaService;

  const mockProduct = {
    id: 'prod-1',
    title: 'Berger Robbialac Synthetic Enamel',
    basePrice: 240,
    stock: 50,
    isActive: true,
    unit: 'Volume (Litre)',
    images: JSON.stringify(['/products/2412.jpg']),
    variants: [
      { id: 'var-1', name: '0.91 Litre Tin', price: 450, stock: 20 },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findUnique: jest.fn().mockResolvedValue(mockProduct),
            },
          },
        },
        {
          provide: RedisService,
          useValue: {
            getCart: jest.fn().mockResolvedValue(null),
            setCart: jest.fn().mockResolvedValue(undefined),
            deleteCart: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    redisService = module.get<RedisService>(RedisService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty cart if nothing stored in Redis', async () => {
    const cart = await service.getCart('cart-empty');
    expect(cart.items.length).toBe(0);
    expect(cart.subtotal).toBe(0);
    expect(cart.itemCount).toBe(0);
  });

  it('should calculate accurate subtotals and variant prices', async () => {
    const cart = await service.addItem('cart-1', {
      productId: 'prod-1',
      variantId: 'var-1',
      quantity: 2,
    });

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].unitPrice).toBe(450);
    expect(cart.items[0].lineTotal).toBe(900);
    expect(cart.subtotal).toBe(900);
    expect(cart.itemCount).toBe(2);
  });
});
