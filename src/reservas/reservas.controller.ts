import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Reserva } from './reserva.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateReservaDto) {
    const reserva = await this.service.create(dto);
    if (!reserva) throw new InternalServerErrorException('Failed to create reserva');
    return new SuccessResponseDto('Reserva created successfully', reserva);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Reserva>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.service.findAll(query);

    if (!result) throw new InternalServerErrorException('Could not retrieve reservas');

    return new SuccessResponseDto('Reservas retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const reserva = await this.service.findOne(id);
    if (!reserva) throw new NotFoundException('Reserva not found');
    return new SuccessResponseDto('Reserva retrieved successfully', reserva);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateReservaDto) {
    const reserva = await this.service.update(id, dto);
    if (!reserva) throw new NotFoundException('Reserva not found');
    return new SuccessResponseDto('Reserva updated successfully', reserva);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const reserva = await this.service.remove(id);
    if (!reserva) throw new NotFoundException('Reserva not found');
    return new SuccessResponseDto('Reserva deleted successfully', reserva);
  }
}
