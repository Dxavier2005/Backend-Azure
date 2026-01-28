import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { MultasService } from './multas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateMultaDto } from './dto/create-multa.dto';
import { UpdateMultaDto } from './dto/update-multa.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Multa } from './multa.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('multas')
export class MultasController {
  constructor(private readonly service: MultasService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateMultaDto) {
    const multa = await this.service.create(dto);
    if (!multa) throw new InternalServerErrorException('Failed to create multa');
    return new SuccessResponseDto('Multa created successfully', multa);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Multa>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.service.findAll(query);

    if (!result) throw new InternalServerErrorException('Could not retrieve multas');

    return new SuccessResponseDto('Multas retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const multa = await this.service.findOne(id);
    if (!multa) throw new NotFoundException('Multa not found');
    return new SuccessResponseDto('Multa retrieved successfully', multa);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMultaDto) {
    const multa = await this.service.update(id, dto);
    if (!multa) throw new NotFoundException('Multa not found');
    return new SuccessResponseDto('Multa updated successfully', multa);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const multa = await this.service.remove(id);
    if (!multa) throw new NotFoundException('Multa not found');
    return new SuccessResponseDto('Multa deleted successfully', multa);
  }
}
