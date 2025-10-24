import { Injectable, NotFoundException } from '@nestjs/common';
import { UpsertReviewDTO } from './dto/upsert-review-dto';
import { InjectModel } from '@nestjs/sequelize';
import { MovieReview } from './entities/movie-review.entity';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class MovieReviewsService {
  constructor(
    @InjectModel(MovieReview)
    private readonly movieReviewModel: typeof MovieReview,

    @InjectModel(Movie)
    private readonly movieModel: typeof Movie,
  ) {}

  async upsert(upsertReviewDto: UpsertReviewDTO & { user_id: number }) {
    const { user_id, movie_id, review, rating } = upsertReviewDto;

    const movieExists = await this.movieModel.findByPk(movie_id);
    if (!movieExists) {
      throw new NotFoundException('Movie not found');
    }

    const [reviewRecord] = await this.movieReviewModel.upsert(
      {
        user_id,
        movie_id,
        review,
        rating,
      },
      {
        conflictFields: ['user_id', 'movie_id'],
        returning: true,
      },
    );

    return reviewRecord;
  }

  async findByMovie(movie_id: number, current_user_id?: number) {
    console.log(current_user_id);
    const reviews = await this.movieReviewModel.findAll({
      where: { movie_id },
      include: ['user'],
      order: [['created_at', 'DESC']],
    });

    const enhancedReviews = reviews.map((r) => {
      const { user, ...reviewWithoutUser } = r.toJSON();

      return {
        ...reviewWithoutUser,
        current_user_review: current_user_id
          ? user?.id === current_user_id
          : false,
      };
    });

    return enhancedReviews;
  }
}
