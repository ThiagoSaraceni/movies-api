import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Name of the movie',
    example: 'Inception',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Duration of the movie in minutes',
    example: 148,
  })
  @IsInt()
  duration: number;

  @ApiProperty({
    description: 'Release year of the movie',
    example: 2010,
  })
  @IsInt()
  year: number;

  @ApiProperty({
    description: 'Director of the movie',
    example: 'Christopher Nolan',
  })
  @IsString()
  director: string;

  @ApiPropertyOptional({
    description: 'Short description or synopsis of the movie',
    example:
      'A skilled thief is given a chance to have his past crimes forgiven if he implants an idea into someone’s subconscious.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL of the movie poster or image',
    example: 'https://example.com/images/inception.jpg',
  })
  @IsString()
  @IsOptional()
  img_url?: string;

  @ApiPropertyOptional({
    description: 'Array of genre IDs associated with the movie',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  genresIds?: number[];
}
