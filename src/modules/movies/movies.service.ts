import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie)
    private movieModel: typeof Movie,

    @InjectModel(Genre)
    private genreModel: typeof Genre,
  ) {}

  // TODO: só admin
  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      const { genresIds, ...movieData } = createMovieDto;

      const movie = await this.movieModel.create(movieData);

      if (genresIds && genresIds.length > 0) {
        const genres = await Genre.findAll({
          where: { id: genresIds },
        });
        await movie.$set('genres', genres);
      }

      return movie;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    return this.movieModel.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  // TODO: só admin
  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  // TODO: só admin
  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
