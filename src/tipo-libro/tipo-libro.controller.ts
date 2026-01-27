import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { TipoLibroService } from './tipo-libro.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateTipoLibroDto } from './dto/create-tipo-libro.dto';
import { UpdateTipoLibroDto } from './dto/update-tipo-libro.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TipoLibro } from './tipo-libro.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('tipo-libro')
export class TipoLibroController {
  constructor(private readonly service: TipoLibroService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateTipoLibroDto) {
    const tipoLibro = await this.service.create(dto);
    if (!tipoLibro) throw new InternalServerErrorException('Failed to create tipo libro');
    return new SuccessResponseDto('Tipo libro created successfully', tipoLibro);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<TipoLibro>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.service.findAll(query);

    if (!result) throw new InternalServerErrorException('Could not retrieve tipos libro');

    return new SuccessResponseDto('Tipos libro retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tipoLibro = await this.service.findOne(id);
    if (!tipoLibro) throw new NotFoundException('Tipo libro not found');
    return new SuccessResponseDto('Tipo libro retrieved successfully', tipoLibro);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTipoLibroDto) {
    const tipoLibro = await this.service.update(id, dto);
    if (!tipoLibro) throw new NotFoundException('Tipo libro not found');
    return new SuccessResponseDto('Tipo libro updated successfully', tipoLibro);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const tipoLibro = await this.service.remove(id);
    if (!tipoLibro) throw new NotFoundException('Tipo libro not found');
    return new SuccessResponseDto('Tipo libro deleted successfully', tipoLibro);
  }
}
