import { Injectable, NotFoundException } from '@nestjs/common';
import { UpsertReviewDTO } from './dto/upsert-review-dto';
import { InjectModel } from '@nestjs/sequelize';
import { MovieReview } from './entities/movie-review.entity';
import { Movie } from '../movies/entities/movie.entity';
import { col, fn } from 'sequelize';

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

  async findByMovie(movie_id: number) {
    const ratingData: any = await this.movieReviewModel.findOne({
      where: { movie_id },
      attributes: [[fn('AVG', col('rating')), 'avgRating']],
      raw: true,
    });

    const averageRating = ratingData?.avgRating
      ? Math.ceil(Number(ratingData.avgRating))
      : 0;

    const reviews = await this.movieReviewModel.findAll({
      where: { movie_id },
      include: ['user'],
      order: [['created_at', 'DESC']],
    });

    const enhancedReviews = reviews.map((r) => {
      const { user, ...reviewWithoutUser } = r.toJSON();
      return {
        ...reviewWithoutUser,
        user_name: user.name,
        user_last_name: user.last_name,
      };
    });

    return {
      reviews: enhancedReviews,
      averageRating,
    };
  }
}
