import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { UrlController } from './tiny-url/url.controller';
import { UrlService } from './tiny-url/url.service';
import { ShortIdFactory } from './tiny-url/shortid-factory';
import { DatabaseProvider } from './database/database';

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
export class AppModule {}