import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import { CreateUrlDTO, CreateUrlDTOSchema } from './create-url.dto';

@Injectable()
export class UrlService {
  constructor(
    @Inject('CASSANDRA_CLIENT')
    private readonly client: Client,
  ) {}

  async createOne(dto: CreateUrlDTO) {
    const { id, url } = await CreateUrlDTOSchema.parseAsync(dto);
    const query = `INSERT INTO urls (id, long_url, created_at) VALUES (?, ?, toTimestamp(now()))`;

    console.log(`Storing id: ${id} and url: ${url}`);
    await this.client.execute(query, [id, url]);
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
