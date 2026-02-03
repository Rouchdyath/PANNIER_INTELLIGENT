import { IsNumber, IsPositive, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePurchaseDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsDateString()
  purchaseDate: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  notes?: string;
}