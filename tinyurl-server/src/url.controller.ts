import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDTO } from './create-url.dto';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  createOne(@Body() dto: CreateUrlDTO) {
    return this.urlService.createOne(dto);
  }

  @Get()
  find() {
    return this.urlService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlService.findById(id);
  }
}
