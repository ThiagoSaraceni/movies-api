import { Controller, Get, Post, Body } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { ApiTags, ApiOperation, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new genre' })
  // @ApiCreatedResponse({
  //   description: 'Genre successfully created',
  //   type: GenreSuccessResponseDto,
  // })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all genres' })
  // @ApiOkResponse({
  //   description: 'Genres retrieved successfully',
  //   type: GenresListResponseDto,
  // })
  findAll() {
    return this.genresService.findAll();
  }
}
