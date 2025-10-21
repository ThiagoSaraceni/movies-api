import {
  BeforeCreate,
  Column,
  DataType,
  HasMany,
  Table,
  Model,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { MovieReview } from 'src/modules/movie-reviews/entities/movie-review.entity';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  })
  role: string;

  @HasMany(() => MovieReview)
  reviews: MovieReview[];

  @BeforeCreate
  static async hashPassword(user: User): Promise<void> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
