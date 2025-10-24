import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertReviewDTO {
  @ApiProperty({
    description: 'ID do filme que será avaliado',
    example: 14,
  })
  @IsInt()
  @IsNotEmpty()
  movie_id: number;

  @ApiProperty({
    description: 'Comentário do usuário sobre o filme',
    example: 'Gostei muito!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Review cannot be empty' })
  review: string;

  @ApiProperty({
    description: 'Nota do usuário de 1 a 5',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
