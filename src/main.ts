import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import chalk from 'chalk';
import { Swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // app.useGlobalGuards(new AuthGuard(new Reflector()));

  const configService = app.get(ConfigService);
  const PORT = +configService.get('PORT') || 4045;

  new Swagger(app);

  await app.listen(PORT, '0.0.0.0', () =>
    console.log(chalk.blue(`Listening on port: ${PORT}`)),
  );
}
void bootstrap();
