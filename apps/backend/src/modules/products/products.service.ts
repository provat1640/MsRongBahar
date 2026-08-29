import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { ProductQueryDto, CreateProductDto, CreateVariantDto, AddReviewDto, ProductRequestDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(query: ProductQueryDto) {
    const { category, unit, search, minPrice, maxPrice, sort } = query;

    // Cache key for unfiltered top-level browse
    const isStandardQuery = !category && !unit && !search && !minPrice && !maxPrice && !sort;
    if (isStandardQuery) {
      const cached = await this.redis.get('cache:products:featured');
      if (cached) return cached;
    }

    const where: any = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }

    if (unit) {
      where.unit = { contains: unit, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) where.basePrice.gte = minPrice;
      if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { basePrice: 'asc' };
    if (sort === 'price_desc') orderBy = { basePrice: 'desc' };
    if (sort === 'name') orderBy = { title: 'asc' };

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const parsed = products.map((p) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    }));

    if (isStandardQuery) {
      await this.redis.set('cache:products:featured', parsed, 300); // 5 min cache
    }

    return parsed;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" was not found.`);
    }

    // Also fetch related products in same category
    const related = await this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: { category: true, variants: true },
    });

    return {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
      related: related.map((r) => ({
        ...r,
        images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images,
      })),
    };
  }

  async getCategories() {
    const cached = await this.redis.get('cache:categories:all');
    if (cached) return cached;

    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    await this.redis.set('cache:categories:all', categories, 600);
    return categories;
  }

  async getUnits() {
    return this.prisma.unit.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async addReview(productId: string, dto: AddReviewDto, userId?: string) {
    const review = await this.prisma.review.create({
      data: {
        productId,
        userId: userId || null,
        customerName: dto.customerName,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    // Invalidate product cache
    await this.redis.del('cache:products:featured');
    return review;
  }

  async createProduct(dto: any) {
    const slug = dto.slug || dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Find or create category
    let category = await this.prisma.category.findFirst({
      where: {
        OR: [
          { id: dto.categoryId || 'unknown' },
          { slug: dto.categoryId || 'unknown' },
          { name: { equals: dto.categoryId || 'General', mode: 'insensitive' } },
        ],
      },
    });

    if (!category) {
      category = await this.prisma.category.create({
        data: {
          name: dto.category?.name || dto.categoryId || 'General Hardware',
          slug: dto.category?.slug || dto.categoryId || `cat-${Date.now()}`,
          description: 'Catalog Category',
        },
      });
    }

    const imagesStr = typeof dto.images === 'string' ? dto.images : JSON.stringify(dto.images || ['/products/2412.jpg']);
    const sku = dto.sku || `SKU-${Date.now()}`;

    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description || `${dto.title} available at M/S Rong Bahar.`,
        categoryId: category.id,
        basePrice: Number(dto.basePrice) || 0,
        stock: Number(dto.stock) || 0,
        sku,
        images: imagesStr,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
        unit: dto.unit || 'pcs',
        variants:
          dto.variants && Array.isArray(dto.variants) && dto.variants.length > 0
            ? {
                create: dto.variants.map((v: any) => ({
                  name: v.name,
                  price: Number(v.price) || 0,
                  stock: Number(v.stock) || 0,
                  sku: v.sku || `${sku}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    // Invalidate Redis cache
    await this.redis.del('cache:products:featured');
    await this.redis.del('cache:categories:all');

    return {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
    };
  }

  async deleteProduct(id: string) {
    const deleted = await this.prisma.product.delete({
      where: { id },
    });
    await this.redis.del('cache:products:featured');
    return deleted;
  }

  async requestUnlistedProduct(dto: ProductRequestDto) {
    return this.prisma.productRequest.create({
      data: {
        customerName: dto.customerName,
        phone: dto.phone,
        productName: dto.productName,
        brand: dto.brand || null,
        notes: dto.notes || null,
      },
    });
  }
}
