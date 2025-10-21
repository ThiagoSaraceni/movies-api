import {
  Table,
  Column,
  Model,
  DataType,
  //   BelongsToMany,
  //   HasMany,
} from 'sequelize-typescript';
// import { Genre } from './genre.model';
// import { MovieGenre } from './movie-genre.model';
// import { MovieReview } from './movie-review.model';

@Table({
  tableName: 'movies',
  timestamps: true,
  underscored: true,
})
export class Movie extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nome: string;

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
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updated_at: Date;

  //   @BelongsToMany(() => Genre, () => MovieGenre)
  //   genres: Genre[];

  //   @HasMany(() => MovieReview)
  //   reviews: MovieReview[];
}
