import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './modules/movies/movies.module';
import { DatabaseModule } from './config/database.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [DatabaseModule, MoviesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
