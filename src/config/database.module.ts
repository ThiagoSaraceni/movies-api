import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Genre } from 'src/modules/genres/entities/genre.entity';
import { MovieReview } from 'src/modules/movie-reviews/entities/movie-review.entity';
import { MovieGenre } from 'src/modules/movies/entities/movie-genre.entity';
import { Movie } from 'src/modules/movies/entities/movie.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Module({
  imports: [
    // TODO: adicionar env dps
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 8888,
      username: 'pgadmin',
      password: 'pgadmin',
      database: 'movies_db',
      models: [Movie, User, Genre, MovieReview, MovieGenre],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
