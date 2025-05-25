import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import { CreateUrlDTO, CreateUrlDTOSchema } from './create-url.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ShortIdFactory } from './shortid-factory';
import { DATABASE_TOKEN } from './database';

@Injectable()
export class UrlService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly client: Client,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly shortIdFactory: ShortIdFactory,
  ) {}

  async createOne(dto: CreateUrlDTO) {
    const { url } = await CreateUrlDTOSchema.parseAsync(dto);

    const shortId = this.shortIdFactory.get();

    await this.createShortUrl(shortId, url);

    return { id: shortId };
  }

  private async createShortUrl(id: string, url: string): Promise<void> {
    Logger.log(`Storing id: ${id} and url: ${url}`, UrlService);

    const result = await this.client.execute(
      'INSERT INTO urls (id, long_url, created_at) VALUES (?, ?, toTimestamp(now())) IF NOT EXISTS',
      [id, url],
      { prepare: true },
    );

    if (!result.wasApplied()) {
      throw new ConflictException('Existed url');
    }

    // Write through cache
    const TWENTY_FOUR_HOURS_CACHE_TTL = 1000 * 60 * 60 * 24;
    await this.cache.set(id, url, TWENTY_FOUR_HOURS_CACHE_TTL);
  }

  find() {
    const query = `SELECT * FROM urls`;

    return this.client.execute(query);
  }

  async findById(id: string) {
    const url = await this.cache.get<string>(id);

    if (url !== null) {
      Logger.log(`Found cached ${url}`);

      return {
        long_url: url,
      };
    }

    // TODO: Need to prevent cache bursting
    const query = `SELECT * FROM urls where id = ?`;

    const resultSet = await this.client.execute(query, [id]);

    return resultSet.rows[0];
  }
}
