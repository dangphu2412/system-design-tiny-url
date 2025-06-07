import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { Client, types } from 'cassandra-driver';
import { CreateUrlDTO, CreateUrlDTOSchema } from './create-url.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ShortIdFactory } from './shortid-factory';
import { DATABASE_TOKEN } from '../database/database';
import { randomInt } from 'crypto';
import ResultSet = types.ResultSet;

type TinyURLEntity = {
  id: string;
  long_url: string;
  created_at: string;
  last_read_at: string;
}

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

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
    this.logger.log(`Storing id: ${id} and url: ${url}`, UrlService);

    const result = await this.client.execute(
      'INSERT INTO urls (id, long_url, created_at, last_read_at) VALUES (?, ?, toTimestamp(now()), toTimestamp(now())) IF NOT EXISTS',
      [id, url],
      { prepare: true },
    );

    if (!result.wasApplied()) {
      this.logger.error(JSON.stringify(result.info));
      throw new ConflictException('Existed url');
    }

    await this.saveToCache(id, url);
  }

  /**
   * Just for testing, so no cache applied
   */
  async find() {
    const query = `SELECT * FROM urls`;

    const resultSet = await this.client.execute(query);

    return this.mapResultSetToEntities(resultSet);
  }

  async findById(id: string) {
    const url = await this.cache.get<string>(id);

    if (url !== null) {
      this.logger.log(`Cache hit on ${url}`);
      this.updateLastReadAt(id);

      return {
        long_url: url,
      };
    }

    // TODO: Need to prevent cache bursting
    const query = `SELECT * FROM urls where id = ?`;

    const resultSet = await this.client.execute(query, [id]);
    const entity = this.mapResultSetToEntity(resultSet);

    if (entity) {
      await this.saveToCache(entity.id, entity.long_url);
    }

    this.updateLastReadAt(id);
    return entity;
  }

  private saveToCache(id: string, url: string) {
    /**
     * Random TTL section to avoid
     */
    const TTL = 1000 * randomInt(30, 120) * 10;
    this.logger.log(`Storing cached ${id} in ${TTL}`);

    return this.cache.set(id, url, TTL);
  }

  private mapResultSetToEntity(resultSet: ResultSet): TinyURLEntity | null {
    return this.mapResultSetToEntities(resultSet)?.[0];
  }

  private mapResultSetToEntities(resultSet: ResultSet): TinyURLEntity[] {
    return resultSet.rows.map(row => {
      return {
        id: row.get('id'),
        long_url: row.get('long_url'),
        created_at: row.get('created_at'),
        last_read_at: row.get('last_read_at'),
      }
    })
  }

  /**
   * TODO:
   * - Cons: This operation cause overhead to database due to update during read
   * -> Put it in async event queue to reduce DB workload
   */
  private async updateLastReadAt(id: string) {
    this.logger.log(`Update last read at: ${id}`);
    await this.client.execute(`UPDATE urls SET last_read_at = toTimestamp(now()) WHERE id = ?`, [id]);
    this.logger.log(`Updated last read at: ${id}`);
  }
}
