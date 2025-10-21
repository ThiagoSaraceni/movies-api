import { Model } from 'sequelize';
import { BeforeCreate, Column, DataType, Table } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

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

  //   @HasMany(() => MovieReview)
  //   reviews: MovieReview[];

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
