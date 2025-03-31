import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @ApiProperty({ example: 'captchaToken' })
    @IsString()
    @IsNotEmpty()
    captchaToken: string;
  }