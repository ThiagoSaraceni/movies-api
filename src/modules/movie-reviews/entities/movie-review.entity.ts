import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';
import { Movie } from 'src/modules/movies/entities/movie.entity';

@Table({
  tableName: 'movie_reviews',
  timestamps: true,
  underscored: true,
})
export class MovieReview extends Model<MovieReview, Partial<MovieReview>> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  user_id: number;

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'movie_id',
  })
  movie_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  review: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  })
  rating: number;

  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updated_at: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Movie)
  movie: Movie;
}
