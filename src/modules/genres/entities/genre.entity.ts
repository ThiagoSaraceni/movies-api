import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { Movie } from 'src/modules/movies/entities/movie.entity';
import { MovieGenre } from 'src/modules/movies/entities/movie-genre.entity';

@Table({
  tableName: 'genres',
  timestamps: true,
  underscored: true,
  schema: 'public',
})
export class Genre extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => Movie, () => MovieGenre)
  movies: Movie[];
}
