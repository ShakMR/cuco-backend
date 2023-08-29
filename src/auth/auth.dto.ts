import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
  @ApiProperty({ required: true })
  @IsStrongPassword()
  password: string;
}

export class LoginAuthDto {
  @ApiProperty({ required: true, description: 'JWT token' })
  token: string;
}
