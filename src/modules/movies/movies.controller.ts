import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new movie' })
  // @ApiCreatedResponse({
  //   description: 'Filme criado com sucesso',
  //   type: MovieResponseDto,
  // })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'List with pagination all movies' })
  // @ApiOkResponse({
  //   description: 'Lista de filmes retornada com sucesso',
  //   type: [MovieResponseDto],
  // })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Movie detail' })
  // @ApiOkResponse({
  //   description: 'Filme encontrado com sucesso',
  //   type: MovieResponseDto,
  // })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie' })
  // @ApiOkResponse({
  //   description: 'Filme atualizado com sucesso',
  //   type: MovieResponseDto,
  // })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a movie' })
  @ApiOkResponse({ description: 'Movie removed' })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
