import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Genre } from 'src/modules/genres/entities/genre.entity';
import { MovieReview } from 'src/modules/movie-reviews/entities/movie-review.entity';
import { MovieGenre } from 'src/modules/movies/entities/movie-genre.entity';
import { Movie } from 'src/modules/movies/entities/movie.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  getPostgresDialectOptions,
  parseDatabaseUrl,
  resolveConnectionHost,
} from './postgres-options';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';
        const databaseUrl = config.get<string>('DATABASE_URL');
        const manualIpv4 = config.get<string>('DB_HOST_IPV4');
        const models = [Movie, User, Genre, MovieReview, MovieGenre];

        const baseConfig = {
          dialect: 'postgres' as const,
          models,
          autoLoadModels: true,
          synchronize: !isProduction,
          logging: config.get('DB_LOGGING') === 'true' ? console.log : false,
        };

        if (databaseUrl) {
          const parsed = parseDatabaseUrl(databaseUrl);
          const host = await resolveConnectionHost(parsed.host, manualIpv4);

          return {
            ...baseConfig,
            host,
            port: parsed.port,
            username: parsed.username,
            password: parsed.password,
            database: parsed.database,
            dialectOptions: getPostgresDialectOptions(config, databaseUrl),
          };
        }

        const hostname = config.get('DB_HOST', 'localhost');
        const host = await resolveConnectionHost(hostname, manualIpv4);

        return {
          ...baseConfig,
          host,
          port: config.get<number>('DB_PORT', 8888),
          username: config.get('DB_USER', 'pgadmin'),
          password: config.get('DB_PASSWORD', 'pgadmin'),
          database: config.get('DB_NAME', 'movies_db'),
          dialectOptions: getPostgresDialectOptions(config, hostname),
        };
      },
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
