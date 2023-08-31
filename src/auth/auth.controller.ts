import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginAuthDto, LoginRequestDto } from './auth.dto';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginRequestDto,
  })
  @HttpCode(HttpStatus.OK)
  login(@Request() req): LoginAuthDto {
    return this.authService.login(req.user);
  }
}
