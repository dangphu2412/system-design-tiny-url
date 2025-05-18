import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToteEntity } from './totes/entities/tote.entity';
import { TotesDummyCommand } from './totes/totes-dummy-command';
import { NestFactory } from '@nestjs/core';
import * as process from 'node:process';

// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

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
        entities: [ToteEntity], // Add your entities here
        // synchronize: true -> DEVELOPMENT ONLY! Automatically creates/updates schema.
        // WARNING: NEVER use synchronize: true in PRODUCTION. Use migrations instead.
        synchronize: false, // For local dev, set to false in production
        logging: true, // Set to true to see SQL queries (can be verbose)
      }),
    }),
    TypeOrmModule.forFeature([ToteEntity]),
  ],
  providers: [TotesDummyCommand],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.get(TotesDummyCommand).run([]);
  process.exit(0);
}
bootstrap();
