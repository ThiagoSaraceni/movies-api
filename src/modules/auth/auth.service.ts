import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersRole } from '../users/enums/users-role.enum';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const hash = user.get('password');

    if (user && (await bcrypt.compare(password, hash))) {
      const result = user.get({ plain: true }) as Omit<User, 'password'>;
      return result;
    }
    return null;
  }

  async login(payload: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(payload.email, payload.password);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'access', role: user.role },
      {
        expiresIn: '15m',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'refresh' },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }

  async register(
    payload: AuthRegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await this.usersService.createUser({
      name: payload.name,
      last_name: payload.last_name,
      email: payload.email,
      password: payload.password,
      role: UsersRole.USER,
    });

    return this.login({
      email: payload.email,
      password: payload.password,
    });
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify<{
        sub: number;
        email: string;
        type: string;
      }>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      if (payload.type !== 'refresh')
        throw new UnauthorizedException('Invalid token type');

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException('User not found');

      const accessToken = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          type: 'access',
          role: user.role,
        },
        {
          expiresIn: '15m',
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
