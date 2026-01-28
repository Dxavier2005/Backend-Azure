import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateComentarioDto) {
    const comentario = await this.comentariosService.create(dto);
    if (!comentario) {
      throw new InternalServerErrorException('Failed to create comment');
    }
    return new SuccessResponseDto('Comment created successfully', comentario);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.comentariosService.findAll({ page, limit });
    if (!result) {
      throw new InternalServerErrorException('Could not retrieve comments');
    }
    return new SuccessResponseDto('Comments retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const comentario = await this.comentariosService.findOne(id);
    if (!comentario) {
      throw new NotFoundException('Comment not found');
    }
    return new SuccessResponseDto('Comment retrieved successfully', comentario);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateComentarioDto) {
    const comentario = await this.comentariosService.update(id, dto);
    if (!comentario) {
      throw new NotFoundException('Comment not found');
    }
    return new SuccessResponseDto('Comment updated successfully', comentario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const comentario = await this.comentariosService.remove(id);
    if (!comentario) {
      throw new NotFoundException('Comment not found');
    }
    return new SuccessResponseDto('Comment deleted successfully', comentario);
  }
}
