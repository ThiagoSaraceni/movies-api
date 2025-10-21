import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';
import { AuthGuard } from './common/guard/auth.guard';
import { RolesGuard } from './common/guard/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  app.useGlobalGuards(app.get(AuthGuard));
  app.useGlobalGuards(new RolesGuard(reflector));

  app.useGlobalPipes(new ValidationPipe());

  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
