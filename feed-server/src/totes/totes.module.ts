import { Module } from '@nestjs/common';
import { TotesService } from './totes.service';
import { TotesResolver } from './totes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToteEntity } from './entities/tote.entity';
import { TotesDummyCommand } from './totes-dummy-command';

@Module({
  imports: [TypeOrmModule.forFeature([ToteEntity])],
  providers: [TotesResolver, TotesService, TotesDummyCommand],
})
export class TotesModule {}
