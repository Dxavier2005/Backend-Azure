import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { MensajesService } from './mensajes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('mensajes')
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateMensajeDto) {
    const mensaje = await this.mensajesService.create(dto);
    if (!mensaje) {
      throw new InternalServerErrorException('Failed to create message');
    }
    return new SuccessResponseDto('Message sent successfully', mensaje);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.mensajesService.findAll({ page, limit });
    if (!result) {
      throw new InternalServerErrorException('Could not retrieve messages');
    }
    return new SuccessResponseDto('Messages retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const mensaje = await this.mensajesService.findOne(id);
    if (!mensaje) {
      throw new NotFoundException('Message not found');
    }
    return new SuccessResponseDto('Message retrieved successfully', mensaje);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const mensaje = await this.mensajesService.remove(id);
    if (!mensaje) {
      throw new NotFoundException('Message not found');
    }
    return new SuccessResponseDto('Message deleted successfully', mensaje);
  }
}
