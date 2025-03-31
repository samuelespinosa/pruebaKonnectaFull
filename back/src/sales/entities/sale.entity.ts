import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProductType } from '../enums/product-type.enum';
import { Franchise } from '../enums/franchise.enum';
import { SaleStatus } from '../enums/sale-status.enum';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ProductType })
  product: ProductType;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  requestedAmount: number;

  @Column({ type: 'enum', enum: Franchise, nullable: true })
  franchise?: Franchise;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  rate?: number;

  @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.OPEN })
  status: SaleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.createdSales)
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedSales)
  updatedBy: User;
}