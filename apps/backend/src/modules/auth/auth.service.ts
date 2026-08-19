import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone: dto.phone }, ...(dto.email ? [{ email: dto.email }] : [])],
      },
    });

    if (existing) {
      throw new BadRequestException('A user with this phone or email already exists.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email || null,
        password: hashedPassword,
        address: dto.address || null,
        district: dto.district || null,
        thana: dto.thana || null,
        role: dto.phone === '01722452836' || dto.phone === 'Habib01722452836' ? 'ADMIN' : 'USER',
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        address: true,
        district: true,
        thana: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone: dto.phoneOrEmail }, { email: dto.phoneOrEmail }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials provided.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials provided.');
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      address: user.address,
      district: user.district,
      thana: user.thana,
      createdAt: user.createdAt,
    };

    const token = this.generateToken(safeUser);
    return { user: safeUser, token };
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        address: true,
        district: true,
        thana: true,
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { items: { include: { product: true, variant: true } } },
        },
      },
    });
  }

  private generateToken(user: { id: string; phone: string; role: string }) {
    return this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });
  }
}
