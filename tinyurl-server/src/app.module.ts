import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { UrlController } from './tiny-url/url.controller';
import { UrlService } from './tiny-url/url.service';
import { ShortIdFactory } from './tiny-url/shortid-factory';
import { URLsEntity } from './database/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health/health.controller';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here too
      inject: [ConfigService], // Inject ConfigService to use it in the factory
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [URLsEntity], // Add your entities here
        synchronize: true, // For local dev, set to false in production
        logging: true, // Set to true to see SQL queries (can be verbose)
      }),
    }),
    TypeOrmModule.forFeature([URLsEntity]),
  ],
  controllers: [UrlController, HealthController],
  providers: [UrlService, ShortIdFactory],
})
export class AppModule {}
