import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class AuthRefreshTokenPayloadDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description:
      'Token JWT para revalidar o token do cliente quando ele expirar.',
    minLength: 100,
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'O refreshToken não pode ser vazio.' })
  @IsString({ message: 'O refreshToken deve ser uma string.' })
  @MinLength(100, {
    message: 'O refreshToken deve ter no mínimo 100 caracteres.',
  })
  @MaxLength(500, {
    message: 'O refreshToken deve ter no máximo 500 caracteres.',
  })
  @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
    message: 'O refreshToken deve ser um JWT válido.',
  })
  refreshToken: string;
}
