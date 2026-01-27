import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query,
  NotFoundException, InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Categoria } from './categories.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('categorias')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateCategoriesDto) {
    const category = await this.service.create(dto);
    if (!category) {
      throw new InternalServerErrorException('Failed to create category');
    }
    return new SuccessResponseDto('Categoría creada correctamente', category);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Categoria>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.service.findAll(query);

    if (!result) {
      throw new InternalServerErrorException('Could not retrieve categories');
    }

    return new SuccessResponseDto('Categorías obtenidas correctamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.service.findOne(id);
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return new SuccessResponseDto('Categoría encontrada', category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoriesDto,
  ) {
    const category = await this.service.update(id, dto);
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return new SuccessResponseDto('Categoría actualizada', category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const category = await this.service.remove(id);
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return new SuccessResponseDto('Categoría eliminada', category);
  }
}
