import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movie } from 'src/modules/movies/entities/movie.entity';

@Module({
  imports: [
    // TODO: adicionar env dps
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 8888,
      username: 'pgadmin',
      password: 'pgadmin',
      database: 'movies_db',
      models: [Movie],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
