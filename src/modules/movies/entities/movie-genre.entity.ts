import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Movie } from './movie.entity';
import { Genre } from 'src/modules/genres/entities/genre.entity';

@Table({
  tableName: 'movie_genres',
  timestamps: false,
  underscored: true,
})
export class MovieGenre extends Model {
  @ForeignKey(() => Movie)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'movie_id',
  })
  movie_id: number;

  @ForeignKey(() => Genre)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'genre_id',
  })
  genre_id: number;
}
