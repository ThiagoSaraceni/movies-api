import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieReviewDto } from './create-movie-review.dto';

export class UpdateMovieReviewDto extends PartialType(CreateMovieReviewDto) {}
