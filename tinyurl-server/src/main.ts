import { NestFactory } from '@nestjs/core';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env', // Specify the .env file path
    }),
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [createKeyv('redis://localhost:6379')],
        };
      },
      isGlobal: true,
    }),
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`${await app.getUrl()}`);
}

bootstrap();
