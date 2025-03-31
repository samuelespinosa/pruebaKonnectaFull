import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations:['createdSales', 'updatedSales']
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User|null> {
    return this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'role'] 
    });
  }

  async update(
    id: number, 
    updateUserDto: UpdateUserDto,
    currentUser?: { id: number; role: Role }
  ): Promise<User> {
    if (updateUserDto.role && currentUser?.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can change user roles');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.findOne(id);
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async validateUserAccess(
    userId: number, 
    currentUser: { id: number; role: Role }
  ): Promise<boolean> {
    if (currentUser.role === Role.ADMIN) return true;
    return userId === currentUser.id;
  }
}