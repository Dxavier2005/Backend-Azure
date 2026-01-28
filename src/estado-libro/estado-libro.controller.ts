import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { EstadoLibroService } from './estado-libro.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateEstadoLibroDto } from './dto/create-estado-libro.dto';
import { UpdateEstadoLibroDto } from './dto/update-estado-libro.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EstadoLibro } from './estado-libro.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('estado-libro')
export class EstadoLibroController {
  constructor(private readonly service: EstadoLibroService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateEstadoLibroDto) {
    const estadoLibro = await this.service.create(dto);
    if (!estadoLibro) throw new InternalServerErrorException('Failed to create estado libro');
    return new SuccessResponseDto('Estado libro created successfully', estadoLibro);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<EstadoLibro>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.service.findAll(query);

    if (!result) throw new InternalServerErrorException('Could not retrieve estados libro');

    return new SuccessResponseDto('Estados libro retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const estadoLibro = await this.service.findOne(id);
    if (!estadoLibro) throw new NotFoundException('Estado libro not found');
    return new SuccessResponseDto('Estado libro retrieved successfully', estadoLibro);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEstadoLibroDto) {
    const estadoLibro = await this.service.update(id, dto);
    if (!estadoLibro) throw new NotFoundException('Estado libro not found');
    return new SuccessResponseDto('Estado libro updated successfully', estadoLibro);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const estadoLibro = await this.service.remove(id);
    if (!estadoLibro) throw new NotFoundException('Estado libro not found');
    return new SuccessResponseDto('Estado libro deleted successfully', estadoLibro);
  }
}
