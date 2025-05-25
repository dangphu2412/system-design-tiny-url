import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import { CreateUrlDTO, CreateUrlDTOSchema } from './create-url.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as crypto from 'crypto';

function toBase62(num: number): string {
  const BASE62 =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let str = '';
  while (num > 0) {
    str = BASE62[num % 62] + str;
    num = Math.floor(num / 62);
  }
  return str || '0';
}

export function generateShortId(): string {
  const timestamp = Date.now() % 1e8; // last 8 digits of timestamp (~27 bits)
  const random = crypto.randomInt(0, 62 ** 3); // ~18 bits of randomness
  const idNumber = timestamp * 62 ** 3 + random; // combine both

  return toBase62(idNumber).padStart(7, '0').slice(0, 7); // trim to 7 chars
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

    const shortId = generateShortId();
    Logger.log(`Storing id: ${shortId} and url: ${url}`);

    await this.createShortUrl(shortId, url);

    return { id: shortId };
  }

  private async createShortUrl(id: string, url: string): Promise<void> {
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

    const query = `SELECT * FROM urls where id = ?`;

    const resultSet = await this.client.execute(query, [id]);

    return resultSet.rows[0];
  }
}
