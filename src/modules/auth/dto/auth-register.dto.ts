import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty({ example: 'Maria', description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'Silva', description: 'Sobrenome do usuário' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  last_name: string;

  @ApiProperty({ example: 'maria@email.com', description: 'E-mail do usuário' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha do usuário',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
