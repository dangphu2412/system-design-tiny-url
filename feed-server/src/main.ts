import { NestFactory } from '@nestjs/core';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ToteEntity } from './totes/entities/tote.entity';
import { TotesModule } from './totes/totes.module';

// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    TotesModule,
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
        synchronize: true, // For local dev, set to false in production
        logging: true, // Set to true to see SQL queries (can be verbose)
      }),
    }),
    TypeOrmModule.forFeature([ToteEntity]),
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [createKeyv('redis://localhost:6379')],
        };
      },
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Auto-generate schema
      sortSchema: true,
      playground: false,
      graphiql: true,
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
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
