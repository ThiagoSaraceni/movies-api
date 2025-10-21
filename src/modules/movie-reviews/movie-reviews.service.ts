import { Injectable } from '@nestjs/common';
import { CreateMovieReviewDto } from './dto/create-movie-review.dto';
import { UpdateMovieReviewDto } from './dto/update-movie-review.dto';

@Injectable()
export class MovieReviewsService {
  create(createMovieReviewDto: CreateMovieReviewDto) {
    return 'This action adds a new movieReview';
  }

  findAll() {
    return `This action returns all movieReviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movieReview`;
  }

  update(id: number, updateMovieReviewDto: UpdateMovieReviewDto) {
    return `This action updates a #${id} movieReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} movieReview`;
  }
}
