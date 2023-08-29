import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
  @ApiProperty({ required: true })
  // @IsStrongPassword() TODO: enable this
  password: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;
}
