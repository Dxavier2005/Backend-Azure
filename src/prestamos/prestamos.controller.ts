import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreatePrestamoDto } from './dto/create-prestamos.dto';
import { UpdatePrestamoDto } from './dto/update-prestamos.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Prestamo } from './prestamos.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly service: PrestamosService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreatePrestamoDto) {
    const prestamo = await this.service.create(dto);
    if (!prestamo) throw new InternalServerErrorException('Failed to create prestamo');
    return new SuccessResponseDto('Prestamo created successfully', prestamo);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Prestamo>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.service.findAll(query);

    if (!result) throw new InternalServerErrorException('Could not retrieve prestamos');

    return new SuccessResponseDto('Prestamos retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const prestamo = await this.service.findOne(id);
    if (!prestamo) throw new NotFoundException('Prestamo not found');
    return new SuccessResponseDto('Prestamo retrieved successfully', prestamo);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePrestamoDto) {
    const prestamo = await this.service.update(id, dto);
    if (!prestamo) throw new NotFoundException('Prestamo not found');
    return new SuccessResponseDto('Prestamo updated successfully', prestamo);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const prestamo = await this.service.remove(id);
    if (!prestamo) throw new NotFoundException('Prestamo not found');
    return new SuccessResponseDto('Prestamo deleted successfully', prestamo);
  }
}
