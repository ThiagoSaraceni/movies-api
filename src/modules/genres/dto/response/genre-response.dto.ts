import { ApiProperty } from '@nestjs/swagger';

export class GenreResponseDto {
  @ApiProperty({ description: 'ID do gênero', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do gênero', example: 'Ação' })
  name: string;
}
