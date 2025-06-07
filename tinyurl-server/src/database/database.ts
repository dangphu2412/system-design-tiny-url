import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'cassandra-driver';

export const DATABASE_TOKEN = 'CASSANDRA_CLIENT';

export const DatabaseProvider: Provider = {
  inject: [ConfigService],
  provide: 'CASSANDRA_CLIENT',
  useFactory: async (configService: ConfigService) => {
    const client = new Client({
      contactPoints: [configService.getOrThrow('CASSANDRA_CONTACT_POINTS')],
      localDataCenter: 'dc1',
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
              created_at timestamp,
            );`.replace(/\n*/g, ''),
    );

    client.keyspace = 'shortener';
    return client;
  },
};
