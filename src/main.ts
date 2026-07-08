import { NestFactory, Reflector } from '@nestjs/core';
import './config/postgres-options';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';
import { AuthGuard } from './common/guard/auth.guard';
import { RolesGuard } from './common/guard/roles.guard';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const corsOrigin =
    process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ??
    'http://localhost:3001';

  app.useGlobalGuards(app.get(AuthGuard));
  app.useGlobalGuards(new RolesGuard(reflector));

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
