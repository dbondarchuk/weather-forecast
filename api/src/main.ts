import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = env.PORT ?? 3001;
  app.enableCors();

  console.log(`Listening on port ${port}`);
  await app.listen(port);
}

bootstrap();
