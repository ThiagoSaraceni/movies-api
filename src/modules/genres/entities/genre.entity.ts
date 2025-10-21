import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Movie } from 'src/modules/movies/entities/movie.entity';
import { MovieGenre } from 'src/modules/movies/entities/movie-genre.entity';

@Table({
  tableName: 'genres',
  timestamps: true,
  underscored: true,
})
export class Genre extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

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

  @BelongsToMany(() => Movie, () => MovieGenre)
  movies: Movie[];
}
