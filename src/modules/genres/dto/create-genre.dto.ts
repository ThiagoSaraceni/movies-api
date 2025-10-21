import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({
    description: 'Nome do gênero',
    example: 'Ação',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
