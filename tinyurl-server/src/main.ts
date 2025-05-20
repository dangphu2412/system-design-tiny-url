import { NestFactory } from '@nestjs/core';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Client } from 'cassandra-driver';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

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
  controllers: [UrlController],
  providers: [
    UrlService,
    {
      provide: 'CASSANDRA_CLIENT',
      useFactory: async () => {
        const client = new Client({
          contactPoints: ['localhost'],
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
        client.on('log', (level, loggerName, message) => {
          Logger.log(
            `${level} - ${loggerName}:  ${message}`,
            'CASSANDRA_CLIENT',
          );
        });
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
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`${await app.getUrl()}`);
}

bootstrap();
