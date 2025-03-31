import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { User } from '../users/entities/user.entity';
import { ProductType } from './enums/product-type.enum';
import { Franchise } from './enums/franchise.enum';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { Role } from 'src/shared/enums/role.enum';
@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
  ) {}

  async create(createSaleDto: CreateSaleDto, user: UserPayloadDto): Promise<Sale | null> {
    this.validateProductRules(createSaleDto);
  
    const sale = this.salesRepository.create({
      ...createSaleDto,
      createdBy: { id: user.id }, 
      updatedBy: { id: user.id },  
    });
  
    const savedSale = await this.salesRepository.save(sale);
    return this.salesRepository.findOne({
      where: { id:savedSale.id },
      relations: ['createdBy', 'updatedBy'], 
      select: {
        id: true,
        product: true,
        requestedAmount: true,
        status: true,
        createdBy: { id: true, name: true }, 
        updatedBy: { id: true, name: true }
      }
    });
  }
  async findAll(user?: UserPayloadDto, status?: string): Promise<Sale[]> {
    const query = this.salesRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.createdBy', 'createdBy')
      .orderBy('sale.createdAt', 'DESC');

    if (user?.role !== 'Administrador') {
      query.where('createdBy.id = :userId', { userId: user?.id });
    }

    if (status) {
      query.andWhere('sale.status = :status', { status });
    }

    return query.getMany();
  }

  async findOne(id: number, user?: UserPayloadDto): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['createdBy','updatedBy'],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    if (user?.role !== 'Administrador' && sale.createdBy.id !== user?.id) {
      throw new ForbiddenException('You can only access your own sales');
    }

    return sale;
  }

  Copy

  async update(
    id: number,
    updateSaleDto: UpdateSaleDto,
    user: UserPayloadDto
  ): Promise<Sale|null> {
    const sale = await this.findOne(id, user);
    
    const updateData = {
      ...updateSaleDto,
      updatedBy: { id: user.id },  // Reference user by ID
    };
  

    this.salesRepository.merge(sale, updateData);
    await this.salesRepository.save(sale);
    return this.salesRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'], 
      select: {
        id: true,
        product: true,
        requestedAmount: true,
        status: true,
        createdBy: { id: true, name: true }, 
        updatedBy: { id: true, name: true }
      }
    });
  }

  async remove(id: number, user: UserPayloadDto): Promise<void> {
    await this.findOne(id, user); // Verify access first
    await this.salesRepository.delete(id);
  }
  async getTotalRequestedAmount(user: UserPayloadDto): Promise<number> {
    const query = this.salesRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.requestedAmount)', 'total');

    if (user.role !== 'Administrador') {
      query.where('sale.createdBy.id = :userId', { userId: user.id });
    }

    const result = await query.getRawOne();
    return parseFloat(result.total) || 0;
  }

  private validateProductRules(dto: CreateSaleDto | UpdateSaleDto) {
    if (dto.product === ProductType.CREDIT_CARD && !dto.franchise) {
      throw new Error(
        'Franquicia es obligatoria para Tarjeta de Crédito',
      );
    }

    if (
      (dto.product === ProductType.CONSUMER_CREDIT ||
        dto.product === ProductType.PAYROLL_LOAN) &&
      !dto.rate
    ) {
      throw new Error(
        'Tasa es obligatoria para Crédito de Consumo y Libranza',
      );
    }
  }
}