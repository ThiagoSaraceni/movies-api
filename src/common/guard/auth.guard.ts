import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'src/modules/auth/interface/jwt-payload.interface';
import { CustomRequest } from '../interface/custom-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET not defined in environment variables');
    }
    this.jwtSecret = secret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<CustomRequest & { user?: JwtPayload }>();

    let token: string | undefined;
    const authHeader = request.headers['authorization'];
    if (
      authHeader &&
      !Array.isArray(authHeader) &&
      authHeader.startsWith('Bearer ')
    ) {
      token = authHeader.replace('Bearer ', '');
    }

    if (!token && request?.cookies?.acess_token) {
      token = request?.cookies?.acess_token as string | undefined;
    }

    if (!token) {
      throw new UnauthorizedException(
        'Token não fornecido ou formato inválido',
      );
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.jwtSecret,
      } as JwtVerifyOptions);
    } catch (err) {
      const error = err as { name?: string; message?: string };
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }
      throw new UnauthorizedException('Falha na autenticação');
    }

    if (payload.type !== 'access') {
      throw new UnauthorizedException('Tipo inválido de token');
    }

    request.user = payload;
    return true;
  }
}
