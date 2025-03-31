// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Role } from '../../shared/enums/role.enum';
import { Sale } from '../../sales/entities/sale.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 50, nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, length: 100, select:false})
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.ADVISOR, nullable: false })
  role: Role;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Sale, sale => sale.createdBy)
  createdSales: Sale[];

  @OneToMany(() => Sale, sale => sale.updatedBy)
  updatedSales: Sale[];
}
