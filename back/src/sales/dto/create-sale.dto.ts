import { IsEnum, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { ProductType } from '../enums/product-type.enum';
import { Franchise } from '../enums/franchise.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty({ enum: ProductType, description: 'Tipo de producto financiero' })
  @IsEnum(ProductType)
  product: ProductType;

  @ApiProperty({ example: 1000000, description: 'Monto solicitado en pesos' })
  @IsNumber()
  requestedAmount: number;

  @ApiProperty({
    enum: Franchise,
    required: false,
    description: 'Franquicia de la tarjeta (solo para tarjetas)',
  })
  @IsEnum(Franchise)
  @ValidateIf((o) => o.product === ProductType.CREDIT_CARD)
  franchise?: Franchise;

  @ApiProperty({
    example: 10.5,
    required: false,
    description: 'Tasa de interés (solo para créditos)',
  })
  @IsNumber()
  @ValidateIf(
    (o) =>
      o.product === ProductType.CONSUMER_CREDIT ||
      o.product === ProductType.PAYROLL_LOAN,
  )
  rate?: number;
}