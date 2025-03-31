import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SalesModule } from './sales/sales.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { User } from './users/entities/user.entity';
import { Sale } from './sales/entities/sale.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres', 
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, Sale],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  
    AuthModule,
    UsersModule,
    SalesModule,
  ],
  providers: [
    
   //{ provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}