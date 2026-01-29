import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, NotFoundException,
  InternalServerErrorException, UseGuards
} from '@nestjs/common';
import { LibrosService } from './libros.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Libro } from './libros.entity';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('libros')
export class LibrosController {
  constructor(private readonly service: LibrosService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateLibroDto) {
    const libro = await this.service.create(dto);
    if (!libro) throw new InternalServerErrorException('Failed to create libro');
    return new SuccessResponseDto('Libro created successfully', libro);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Libro>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.service.findAll(query);

    if (!result) throw new InternalServerErrorException('Could not retrieve libros');

    return new SuccessResponseDto('Libros retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const libro = await this.service.findOne(id);
    if (!libro) throw new NotFoundException('Libro not found');
    return new SuccessResponseDto('Libro retrieved successfully', libro);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLibroDto) {
    const libro = await this.service.update(id, dto);
    if (!libro) throw new NotFoundException('Libro not found');
    return new SuccessResponseDto('Libro updated successfully', libro);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const libro = await this.service.remove(id);
    if (!libro) throw new NotFoundException('Libro not found');
    return new SuccessResponseDto('Libro deleted successfully', libro);
  }
}
