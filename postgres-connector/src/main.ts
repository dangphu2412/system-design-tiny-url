import { NestFactory } from '@nestjs/core';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity';
import { CdcListenerService } from './cdc-listener';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env', // Specify the .env file path
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
        entities: [PostEntity], // Add your entities here
        // synchronize: true -> DEVELOPMENT ONLY! Automatically creates/updates schema.
        // WARNING: NEVER use synchronize: true in PRODUCTION. Use migrations instead.
        synchronize: false, // Just listen for changes
        logging: true, // Set to true to see SQL queries (can be verbose)
      }),
    }),
    TypeOrmModule.forFeature([PostEntity]),
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [createKeyv('redis://localhost:6379')],
        };
      },
    }),
  ],
  providers: [CdcListenerService],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
  Logger.log(`${await app.getUrl()}`);
}
bootstrap();
