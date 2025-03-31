import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException
} from '@nestjs/common';

import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { SalesService } from './sales.service';
@ApiTags('Sales')
@ApiBearerAuth()
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.ADVISOR)
  create(
    @Body() createSaleDto: CreateSaleDto,
    @Req() req: { user: UserPayloadDto }
  ) {
    return this.salesService.create(createSaleDto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(
    @Req() req: { user: UserPayloadDto }
      
  ) {
    if (!req.user) throw new UnauthorizedException();
    return this.salesService.findAll(req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: number,
    @Req() req: { user: UserPayloadDto }
  ) {
    return this.salesService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateSaleDto: UpdateSaleDto,
    @Req() req: { user: UserPayloadDto }
  ) {
    return this.salesService.update( id, updateSaleDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(
    @Param('id') id: number,
    @Req() req: { user: UserPayloadDto }
  ) {
    return this.salesService.remove(id, req.user);
  }
}