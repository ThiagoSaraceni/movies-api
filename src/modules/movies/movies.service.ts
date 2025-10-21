import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';
import { GetMoviesQueryDto } from './dto/find-all-movies.dto';
import { Op, WhereOptions } from 'sequelize';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie)
    private movieModel: typeof Movie,

    @InjectModel(Genre)
    private genreModel: typeof Genre,
  ) {}

  //TODO: SO ADMIN
  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      const { genresIds, ...movieData } = createMovieDto;

      const movie = await this.movieModel.create(movieData);

      if (genresIds && genresIds.length > 0) {
        const genres = await this.genreModel.findAll({
          where: { id: genresIds },
        });
        await movie.$set('genres', genres);
      }

      return this.findOne(movie.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query: GetMoviesQueryDto) {
    const { page = 1, limit = 10, name } = query;
    const offset = (page - 1) * limit;

    const where: WhereOptions<Movie> = {};
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }

    const { rows, count } = await this.movieModel.findAndCountAll({
      where,
      include: [{ model: Genre, through: { attributes: [] } }],
      offset,
      limit,
      order: [['id', 'ASC']],
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieModel.findByPk(id, {
      include: [{ model: Genre, through: { attributes: [] } }],
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  // TODO: so admin
  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    try {
      const movie = await this.movieModel.findByPk(id);
      if (!movie) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }

      const { genresIds, ...updateData } = updateMovieDto;

      await movie.update(updateData);

      if (genresIds) {
        const genres = await this.genreModel.findAll({
          where: { id: genresIds },
        });
        await movie.$set('genres', genres);
      }

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // TODO: so admin
  async remove(id: number): Promise<{ message: string }> {
    try {
      const movie = await this.movieModel.findByPk(id);
      if (!movie) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }

      await movie.destroy();
      return { message: `Movie with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
