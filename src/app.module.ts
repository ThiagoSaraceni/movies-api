import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './modules/movies/movies.module';
import { DatabaseModule } from './config/database.module';
import { UsersModule } from './modules/users/users.module';
import { GenresModule } from './modules/genres/genres.module';
import { MovieReviewsModule } from './modules/movie-reviews/movie-reviews.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MoviesModule,
    UsersModule,
    GenresModule,
    MovieReviewsModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
