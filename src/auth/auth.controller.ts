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
  @ApiOkResponse({
    type: LoginAuthDto,
  })
  login(@Request() req): { data: LoginAuthDto } {
    return {
      data: this.authService.login(req.user),
    };
  }
}
