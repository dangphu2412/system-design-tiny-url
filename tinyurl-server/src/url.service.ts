import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, types } from 'cassandra-driver';
import { CreateUrlDTO, CreateUrlDTOSchema } from './create-url.dto';
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
  ) {}

  async createOne(dto: CreateUrlDTO) {
    const { url } = await CreateUrlDTOSchema.parseAsync(dto);
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      attempt++;

      const currentCounterResultSet = await this.findCurrentCounter();

      if (!currentCounterResultSet.rowLength) {
        await this.insertFirstCounter();
      }

      const currentCounter =
        currentCounterResultSet.rowLength > 0
          ? (currentCounterResultSet.first().get('value') as unknown as Long)
          : Long.fromNumber(0);

      const next = currentCounter.add(1);

      // 2. Try to write using Lightweight Transaction
      const lightWeightTransactionResultSet = await this.client.execute(
        'UPDATE counter SET value = ? WHERE key = ? IF value = ?',
        [next.toNumber(), 'url_id', currentCounter.toNumber()],
        { prepare: true },
      );

      // When LWT failed in race condition, fire backoff event
      if (!lightWeightTransactionResultSet.wasApplied()) {
        Logger.warn(`LWT conflict on attempt ${attempt}, retrying...`);
        await new Promise((res) => setTimeout(res, 50 * attempt)); // exponential-ish backoff
        return;
      }

      const shortId = intToBase62(next.toNumber());
      Logger.log(`Storing id: ${shortId} and url: ${url}`);

      // 3. Insert the short URL
      await this.client.execute(
        'INSERT INTO urls (id, long_url, created_at) VALUES (?, ?, toTimestamp(now()))',
        [shortId, url],
        { prepare: true },
      );

      return { id: shortId };
    }

    throw new Error('Could not generate a short URL after multiple retries.');
  }

  private insertFirstCounter() {
    return this.client.execute(
      'INSERT INTO counter (key, value) VALUES (?, ?) IF NOT EXISTS',
      ['url_id', 0],
      { prepare: true },
    );
  }

  private findCurrentCounter() {
    return this.client.execute(
      'SELECT value FROM counter WHERE key = ?',
      ['url_id'],
      { prepare: true },
    );
  }

  find() {
    const query = `SELECT * FROM urls`;

    return this.client.execute(query);
  }

  async findById(id: string) {
    const query = `SELECT * FROM urls where id = ?`;

    const resultSet = await this.client.execute(query, [id]);

    return resultSet.rows[0];
  }
}
