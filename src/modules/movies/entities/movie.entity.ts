import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Genre } from 'src/modules/genres/entities/genre.entity';
import { MovieGenre } from './movie-genre.entity';
import { MovieReview } from 'src/modules/movie-reviews/entities/movie-review.entity';

@Table({
  tableName: 'movies',
  timestamps: true,
  underscored: true,
})
export class Movie extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,
  })
  year: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'Duração em minutos',
  })
  duration: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  director: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'URL da imagem do filme',
  })
  img_url: string;

  @BelongsToMany(() => Genre, () => MovieGenre)
  genres: Genre[];

  @HasMany(() => MovieReview)
  reviews: MovieReview[];
}
