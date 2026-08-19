import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { PlaceOrderDto, ReserveInventoryDto, DeliveryFeeCalculateDto } from './checkout.dto';

@ApiTags('Checkout & Inventory Locking')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('delivery-fee')
  @ApiOperation({ summary: 'Calculate accurate delivery fee based on Bangladesh District & Thana' })
  calculateDeliveryFee(@Body() dto: DeliveryFeeCalculateDto) {
    return this.checkoutService.calculateDeliveryFee(dto);
  }

  @Post('reserve')
  @ApiOperation({ summary: 'Acquire temporary 10-minute Redis lock on inventory before placing order' })
  async reserveInventory(@Body() dto: ReserveInventoryDto) {
    return this.checkoutService.reserveInventory(dto);
  }

  @Post('place-order')
  @ApiOperation({ summary: 'Atomically commit checkout, decrement inventory, and generate order invoice' })
  async placeOrder(@Body() dto: PlaceOrderDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.checkoutService.placeOrder(dto, userId);
  }
}
