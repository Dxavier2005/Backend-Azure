import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { EditorialesService } from './editoriales.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateEditorialDto } from './dto/create-editorial-dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Editorial } from './editorial.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('editoriales')
export class EditorialesController {
  constructor(private readonly service: EditorialesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateEditorialDto) {
    const editorial = await this.service.create(dto);
    if (!editorial) throw new InternalServerErrorException('Failed to create editorial');
    return new SuccessResponseDto('Editorial created successfully', editorial);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Editorial>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.service.findAll(query);

    if (!result) throw new InternalServerErrorException('Could not retrieve editorials');

    return new SuccessResponseDto('Editorials retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const editorial = await this.service.findOne(id);
    if (!editorial) throw new NotFoundException('Editorial not found');
    return new SuccessResponseDto('Editorial retrieved successfully', editorial);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEditorialDto) {
    const editorial = await this.service.update(id, dto);
    if (!editorial) throw new NotFoundException('Editorial not found');
    return new SuccessResponseDto('Editorial updated successfully', editorial);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const editorial = await this.service.remove(id);
    if (!editorial) throw new NotFoundException('Editorial not found');
    return new SuccessResponseDto('Editorial deleted successfully', editorial);
  }
}
