import { NestFactory } from '@nestjs/core';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Client } from 'cassandra-driver';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import morgan from 'morgan';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env', // Specify the .env file path
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
  providers: [
    UrlService,
    {
      inject: [ConfigService],
      provide: 'CASSANDRA_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const client = new Client({
          contactPoints: [configService.getOrThrow('CASSANDRA_CONTACT_POINTS')],
          localDataCenter: 'dc1',
          // keyspace: 'url_keyspace',
        });
        await client.connect();

        await client.execute(
          `CREATE KEYSPACE IF NOT EXISTS shortener
            WITH replication = {
              'class': 'SimpleStrategy',
              'replication_factor': 1
            };
        `.replace(/\n*/g, ''),
        );
        await client.execute(
          `CREATE TABLE IF NOT EXISTS shortener.urls (
              id text PRIMARY KEY,
              long_url text,
              created_at timestamp
            );`.replace(/\n*/g, ''),
        );
        await client.execute(
          `CREATE TABLE IF NOT EXISTS shortener.counter (
                key text PRIMARY KEY,
                value bigint
            );`.replace(/\n*/g, ''),
        );

        client.keyspace = 'shortener';
        return client;
      },
    },
  ],
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
