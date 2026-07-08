import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto, AuthRefreshTokenPayloadDto, AuthRegisterDto } from './dto';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  async register(@Body() payload: AuthRegisterDto) {
    return this.authService.register(payload);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return tokens' })
  async login(@Body() payload: AuthPayloadDto) {
    return this.authService.login(payload);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() refresh: AuthRefreshTokenPayloadDto) {
    return this.authService.refresh(refresh.refreshToken);
  }
}
