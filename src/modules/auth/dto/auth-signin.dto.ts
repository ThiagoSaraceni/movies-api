import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class AuthPayloadDto {
  @ApiProperty({
    example: "usuario@email.com",
    description: "E-mail do usuário para autenticação",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: "senhaSegura123",
    description: "Senha do usuário para autenticação",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
