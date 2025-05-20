import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import { CreateUrlDTO, CreateUrlDTOSchema } from './create-url.dto';

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
  ) {}

  async createOne(dto: CreateUrlDTO) {
    const { url } = await CreateUrlDTOSchema.parseAsync(dto);
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      attempt++;

      // 1. Read current counter
      const res = await this.client.execute(
        'SELECT value FROM counter WHERE key = ?',
        ['url_id'],
        { prepare: true },
      );

      if (!res.rowLength) {
        await this.client.execute(
          'INSERT INTO counter (key, value) VALUES (?, ?) IF NOT EXISTS',
          ['url_id', 0],
          { prepare: true },
        );
      }

      const current =
        res.rowLength > 0
          ? +(res.first().get('value') as unknown as string)
          : 0;
      const next = current + 1;

      // 2. Try to write using LWT
      const lwtRes = await this.client.execute(
        'UPDATE counter SET value = ? WHERE key = ? IF value = ?',
        [next, 'url_id', current],
        { prepare: true },
      );

      if (lwtRes.wasApplied()) {
        const shortId = intToBase62(next);
        Logger.log(`Storing id: ${shortId} and url: ${url}`);

        // 3. Insert the short URL
        await this.client.execute(
          'INSERT INTO urls (id, long_url, created_at) VALUES (?, ?, toTimestamp(now()))',
          [shortId, url],
          { prepare: true },
        );

        return shortId;
      } else {
        console.warn(`LWT conflict on attempt ${attempt}, retrying...`);
        await new Promise((res) => setTimeout(res, 50 * attempt)); // exponential-ish backoff
      }
    }

    throw new Error('Could not generate a short URL after multiple retries.');
  }

  find() {
    const query = `SELECT * FROM urls`;

    return this.client.execute(query);
  }

  findById(id: string) {
    const query = `SELECT * FROM urls where id = ?`;

    return this.client.execute(query, [id]);
  }
}
