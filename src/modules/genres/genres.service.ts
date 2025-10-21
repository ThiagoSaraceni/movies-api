import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre)
    private readonly genreModel: typeof Genre,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    try {
      const existing = await this.genreModel.findOne({
        where: { name: createGenreDto.name },
      });
      if (existing) throw new ConflictException('Genre already exist');

      const genre = await this.genreModel.create({ name: createGenreDto.name });

      return genre;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    return this.genreModel.findAll({ attributes: ['id', 'name'] });
  }
}
