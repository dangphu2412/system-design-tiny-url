import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get('/readyz')
  getHealth() {
    return this.dataSource.isInitialized;
  }
}
