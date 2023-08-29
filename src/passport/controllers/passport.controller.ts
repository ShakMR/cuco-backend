import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PassportService } from '../service/passport.service';
import { SignUpDto } from '../dto/passport.dto';

@ApiTags('auth')
@Controller()
export class PassportController {
  constructor(private service: PassportService) {}
  @Post('signup')
  @ApiBody({
    type: SignUpDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() { email, password, name }: SignUpDto) {
    await this.service.createNewUser({ email, password, name });
  }
}
