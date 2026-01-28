import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { IdiomasService } from './idiomas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateIdiomaDto } from './dto/create-idioma.dto';
import { UpdateIdiomaDto } from './dto/update-idioma.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Idioma } from './idiomas.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('idiomas')
export class IdiomasController {
  constructor(private readonly service: IdiomasService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateIdiomaDto) {
    const idioma = await this.service.create(dto);
    if (!idioma) throw new InternalServerErrorException('Failed to create idioma');
    return new SuccessResponseDto('Idioma created successfully', idioma);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Idioma>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.service.findAll(query);

    if (!result) throw new InternalServerErrorException('Could not retrieve idiomas');

    return new SuccessResponseDto('Idiomas retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const idioma = await this.service.findOne(id);
    if (!idioma) throw new NotFoundException('Idioma not found');
    return new SuccessResponseDto('Idioma retrieved successfully', idioma);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateIdiomaDto) {
    const idioma = await this.service.update(id, dto);
    if (!idioma) throw new NotFoundException('Idioma not found');
    return new SuccessResponseDto('Idioma updated successfully', idioma);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idioma = await this.service.remove(id);
    if (!idioma) throw new NotFoundException('Idioma not found');
    return new SuccessResponseDto('Idioma deleted successfully', idioma);
  }
}
