import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by measurement unit category (Volume, Weight, Dimension, etc.)' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Search term across title, description, SKU, and vendor' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Minimum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Sort by price_asc, price_desc, newest, or name' })
  @IsOptional()
  @IsString()
  sort?: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Berger Robbialac Super Gloss Synthetic Enamel' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'berger-robbialac-enamel-series' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 240 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'BER-ROB-001' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: ['/products/2412.jpg'] })
  @IsArray()
  images: string[];

  @ApiPropertyOptional({ example: 'Volume (Litre)' })
  @IsOptional()
  @IsString()
  unit?: string;
}

export class CreateVariantDto {
  @ApiProperty({ example: '0.91 Litre Tin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 450 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 35 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'BER-ROB-091L' })
  @IsString()
  @IsNotEmpty()
  sku: string;
}

export class AddReviewDto {
  @ApiProperty({ example: 'Rahim' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  rating: number;

  @ApiProperty({ example: 'Outstanding quality and fast local delivery!' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}

export class ProductRequestDto {
  @ApiProperty({ example: 'Habibullah' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '01711223344' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Asian Paints Apex Ultima Protek 20L' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiPropertyOptional({ example: 'Asian Paints' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'Need 3 drums for building project in Mothkhola' })
  @IsOptional()
  @IsString()
  notes?: string;
}
