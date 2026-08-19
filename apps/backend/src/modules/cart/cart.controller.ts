import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CartItemDto, SyncCartDto } from './cart.dto';

@ApiTags('Cart & Session')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':cartId')
  @ApiOperation({ summary: 'Retrieve full cart with live pricing and stock validation from Redis' })
  async getCart(@Param('cartId') cartId: string) {
    return this.cartService.getCart(cartId);
  }

  @Post(':cartId/items')
  @ApiOperation({ summary: 'Add an item or variant to Redis-backed cart' })
  async addItem(@Param('cartId') cartId: string, @Body() itemDto: CartItemDto) {
    return this.cartService.addItem(cartId, itemDto);
  }

  @Put(':cartId/items')
  @ApiOperation({ summary: 'Update quantity of an item in the cart' })
  async updateQuantity(
    @Param('cartId') cartId: string,
    @Body() body: { productId: string; variantId?: string; quantity: number },
  ) {
    return this.cartService.updateItemQuantity(cartId, body.productId, body.variantId, body.quantity);
  }

  @Delete(':cartId/items')
  @ApiOperation({ summary: 'Remove an item from cart' })
  async removeItem(
    @Param('cartId') cartId: string,
    @Query('productId') productId: string,
    @Query('variantId') variantId?: string,
  ) {
    return this.cartService.removeItem(cartId, productId, variantId);
  }

  @Post(':cartId/sync')
  @ApiOperation({ summary: 'Sync local state with Redis cart session' })
  async syncCart(@Param('cartId') cartId: string, @Body() syncDto: SyncCartDto) {
    return this.cartService.syncCart(cartId, syncDto);
  }

  @Delete(':cartId')
  @ApiOperation({ summary: 'Clear all items in cart' })
  async clearCart(@Param('cartId') cartId: string) {
    await this.cartService.clearCart(cartId);
    return { success: true, message: 'Cart cleared.' };
  }
}
