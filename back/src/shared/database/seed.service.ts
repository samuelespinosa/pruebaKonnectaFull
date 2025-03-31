import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Role } from '../../shared/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      console.warn('Admin credentials not configured, skipping seed');
      return;
    }

    try {
      const existingAdmin = await this.usersService.findByEmail(adminEmail);
      if (!existingAdmin) {
        const adminDto: CreateUserDto = {
          name: 'Global Admin',
          email: adminEmail,
          password: adminPassword,
          role: Role.ADMIN,
        };
        await this.usersService.create(adminDto);
        console.log('Global admin user created successfully');
      }
    } catch (error) {
      console.log('Failed to seed admin user:', error.message);
    }
  }
}