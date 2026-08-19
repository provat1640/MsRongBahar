import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber, Min, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckoutItemDto {
  @ApiProperty({ example: 'prod-uuid-123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ example: 'var-uuid-456' })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class DeliveryFeeCalculateDto {
  @ApiProperty({ example: 'Kishoreganj' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ example: 'Pakundia' })
  @IsString()
  @IsNotEmpty()
  thana: string;
}

export class ReserveInventoryDto {
  @ApiProperty({ example: 'sess_98234723' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ type: [CheckoutItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}

export enum PaymentMethodEnum {
  COD = 'COD',
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
}

export class PlaceOrderDto {
  @ApiProperty({ example: 'Rahim Chowdhury' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '01812345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Hospital Road, Mothkhola Bazar' })
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiProperty({ example: 'Kishoreganj' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ example: 'Pakundia' })
  @IsString()
  @IsNotEmpty()
  thana: string;

  @ApiProperty({ enum: PaymentMethodEnum, example: PaymentMethodEnum.COD })
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @ApiPropertyOptional({ example: '9J82K3L4M5' })
  @IsOptional()
  @IsString()
  bkashTrxId?: string;

  @ApiPropertyOptional({ example: '01700112233' })
  @IsOptional()
  @IsString()
  paymentSenderNo?: string;

  @ApiPropertyOptional({ example: 'Please deliver before 5 PM' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'cart-uuid-789' })
  @IsOptional()
  @IsString()
  cartId?: string;

  @ApiPropertyOptional({ example: 'sess_98234723' })
  @IsOptional()
  @IsString()
  reservationSessionId?: string;

  @ApiProperty({ type: [CheckoutItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
