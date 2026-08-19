import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should authenticate user with valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('Habib123', 10);
    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue({
      id: 'usr-admin-1',
      name: 'Manager Habib',
      phone: '01722452836',
      email: 'habib@msrongbahar.com',
      password: hashedPassword,
      role: 'ADMIN' as any,
      address: 'Pakundia',
      district: 'Kishoreganj',
      thana: 'Pakundia',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.login({
      phoneOrEmail: '01722452836',
      password: 'Habib123',
    });

    expect(result).toHaveProperty('token');
    expect(result.user.role).toBe('ADMIN');
    expect(result.token).toBe('mock-jwt-token');
  });
});
