import { IsString, IsNotEmpty, IsOptional, MaxLength, IsNumber, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  categoryId?: number;
}