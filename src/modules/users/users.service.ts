import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(dto: CreateUserDto) {
    try {
      const userAlreadyExist = await this.findByEmail(dto.email);
      if (userAlreadyExist) throw new ConflictException('E-mail already exist');

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.userModel.create({
        email: dto.email,
        password: hashedPassword,
        role: dto.role ?? 'user',
        name: dto.name,
        last_name: dto.last_name,
      });

      return {
        success: true,
        user: {
          first_name: user.get('name'),
          last_name: user.get('last_name'),
          email: user.get('email'),
          role: user.get('role'),
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }
}
