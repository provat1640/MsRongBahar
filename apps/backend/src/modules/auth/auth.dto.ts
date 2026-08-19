import { IsString, IsNotEmpty, MinLength, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Rahim Chowdhury' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '01812345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'rahim@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'user123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'Pakundia Bazar, Kishoreganj' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Kishoreganj' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'Pakundia' })
  @IsOptional()
  @IsString()
  thana?: string;
}

export class LoginDto {
  @ApiProperty({ example: '01722452836' })
  @IsString()
  @IsNotEmpty()
  phoneOrEmail: string;

  @ApiProperty({ example: 'Habib123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
