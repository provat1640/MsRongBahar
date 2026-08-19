import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductQueryDto, AddReviewDto, ProductRequestDto } from './products.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Products & Catalog')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List and filter catalog products with caching' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories with active product counts' })
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get('units')
  @ApiOperation({ summary: 'Get all standard measurement units' })
  async getUnits() {
    return this.productsService.getUnits();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get product detail page (PDP) data by slug with related items' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post(':id/reviews')
  @ApiOperation({ summary: 'Submit a customer review for a product' })
  async addReview(@Param('id') productId: string, @Body() dto: AddReviewDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.productsService.addReview(productId, dto, userId);
  }

  @Post('request-item')
  @ApiOperation({ summary: 'Submit a customer request for an unlisted hardware/paint item' })
  async requestItem(@Body() dto: ProductRequestDto) {
    return this.productsService.requestUnlistedProduct(dto);
  }
}
