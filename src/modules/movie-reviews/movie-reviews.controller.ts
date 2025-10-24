import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MovieReviewsService } from './movie-reviews.service';
import { UpsertReviewDTO } from './dto/upsert-review-dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { JwtPayload } from '../auth/interface/jwt-payload.interface';

@Controller('movie-reviews')
export class MovieReviewsController {
  constructor(private readonly movieReviewsService: MovieReviewsService) {}

  @Post()
  upsert(@Body() upsertDto: UpsertReviewDTO, @CurrentUser() user: JwtPayload) {
    return this.movieReviewsService.upsert({
      ...upsertDto,
      user_id: user.sub,
    });
  }

  @Get(':movie_id')
  findByMovie(@Param('movie_id') movie_id: string) {
    return this.movieReviewsService.findByMovie(+movie_id);
  }
}
