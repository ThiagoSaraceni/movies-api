import { Module } from '@nestjs/common';
import { MovieReviewsService } from './movie-reviews.service';
import { MovieReviewsController } from './movie-reviews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movie } from '../movies/entities/movie.entity';
import { MovieReview } from './entities/movie-review.entity';

@Module({
  imports: [SequelizeModule.forFeature([Movie, MovieReview])],
  controllers: [MovieReviewsController],
  providers: [MovieReviewsService],
})
export class MovieReviewsModule {}
