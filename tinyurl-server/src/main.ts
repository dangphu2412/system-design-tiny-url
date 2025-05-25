import { NestFactory } from '@nestjs/core';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import * as morgan from 'morgan';
import { ShortIdFactory } from './shortid-factory';
import { DatabaseProvider } from './database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          stores: [createKeyv(configService.getOrThrow('REDIS_URL'))],
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  controllers: [UrlController],
  providers: [UrlService, ShortIdFactory, DatabaseProvider],
})
class AppModule {}

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
