import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';
import { Movie } from 'src/modules/movies/entities/movie.entity';

@Table({
  tableName: 'movie_reviews',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'movie_id'],
    },
  ],
})
export class MovieReview extends Model<MovieReview, Partial<MovieReview>> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
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

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Movie)
  movie: Movie;
}
