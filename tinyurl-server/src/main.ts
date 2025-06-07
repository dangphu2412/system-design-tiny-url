import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });
  app.use(morgan('common'));

  await app.listen(process.env.PORT ?? 3000);

  Logger.log(`${await app.getUrl()}`);
}

bootstrap();
