import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto, AuthRefreshTokenPayloadDto } from './dto';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() payload: AuthPayloadDto) {
    return this.authService.login(payload);
  }

  @Public()
  @Post('refresh')
  // TODO: incompleto, logica ainda não foi feita
  async refresh(@Body() refresh: AuthRefreshTokenPayloadDto) {
    return this.authService.refresh(refresh.refreshToken);
  }
}
