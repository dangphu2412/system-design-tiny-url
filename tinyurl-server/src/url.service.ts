import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, types } from 'cassandra-driver';
import { CreateUrlDTO, CreateUrlDTOSchema } from './create-url.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import Long = types.Long;

const MAX_RETRIES = 5;

const BASE62_CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = 62;
const LENGTH = 7;

export function intToBase62(n: number): string {
  let str = '';
  do {
    str = BASE62_CHARS[n % BASE] + str;
    n = Math.floor(n / BASE);
  } while (n > 0);
  return str.padStart(LENGTH, '0');
}

@Injectable()
export class UrlService {
  constructor(
    @Inject('CASSANDRA_CLIENT')
    private readonly client: Client,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async createOne(dto: CreateUrlDTO) {
    const { url } = await CreateUrlDTOSchema.parseAsync(dto);
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      attempt++;

      const currentCounter = await this.findCurrentCounterOrInitIfNotExist();
      const next = currentCounter.add(1);

      const success = await this.tryUpdateCounter(
        currentCounter,
        next,
        attempt,
      );
      if (!success) continue;

      const shortId = intToBase62(next.toNumber());
      Logger.log(`Storing id: ${shortId} and url: ${url}`);

      await this.createShortUrl(shortId, url);

      return { id: shortId };
    }

    throw new Error('Could not generate a short URL after multiple retries.');
  }

  private async findCurrentCounterOrInitIfNotExist() {
    const currentCounterResultSet = await this.client.execute(
      'SELECT value FROM counter WHERE key = ?',
      ['url_id'],
      { prepare: true },
    );

    if (!currentCounterResultSet.rowLength) {
      await this.client.execute(
        'INSERT INTO counter (key, value) VALUES (?, ?) IF NOT EXISTS',
        ['url_id', 0],
        { prepare: true },
      );
      return Long.fromNumber(0);
    }

    return currentCounterResultSet.first().get('value') as Long;
  }

  private async tryUpdateCounter(
    current: Long,
    next: Long,
    attempt: number,
  ): Promise<boolean> {
    const res = await this.client.execute(
      'UPDATE counter SET value = ? WHERE key = ? IF value = ?',
      [next.toNumber(), 'url_id', current.toNumber()],
      { prepare: true },
    );

    if (!res.wasApplied()) {
      Logger.warn(`LWT conflict on attempt ${attempt}, retrying...`);
      await this.backoff(attempt);
      return false;
    }

    return true;
  }

  private async backoff(attempt: number): Promise<void> {
    await new Promise((res) => setTimeout(res, 50 * attempt));
  }

  private async createShortUrl(id: string, url: string): Promise<void> {
    await this.client.execute(
      'INSERT INTO urls (id, long_url, created_at) VALUES (?, ?, toTimestamp(now()))',
      [id, url],
      { prepare: true },
    );
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

    const query = `SELECT * FROM urls where id = ?`;

    const resultSet = await this.client.execute(query, [id]);

    return resultSet.rows[0];
  }
}
