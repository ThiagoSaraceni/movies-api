import { Module } from '@nestjs/common';
import { MoviesModule } from './modules/movies/movies.module';
import { DatabaseModule } from './config/database.module';
import { UsersModule } from './modules/users/users.module';
import { GenresModule } from './modules/genres/genres.module';
import { MovieReviewsModule } from './modules/movie-reviews/movie-reviews.module';
import { MovieGenre } from './modules/movies/entities/movie-genre.entity';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    MoviesModule,
    UsersModule,
    GenresModule,
    MovieReviewsModule,
    MovieGenre,
    AuthModule,
  ],
})
export class AppModule {}
