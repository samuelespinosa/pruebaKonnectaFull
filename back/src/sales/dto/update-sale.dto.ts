import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { SaleStatus } from '../enums/sale-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ApiProperty({
    enum: SaleStatus,
    required: false,
    description: 'Estado de la venta',
  })
  @IsEnum(SaleStatus)
  @IsOptional()
  status?: SaleStatus;
}