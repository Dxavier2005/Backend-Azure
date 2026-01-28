import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, BadRequestException, NotFoundException,
  UseInterceptors, UploadedFile,
  InternalServerErrorException, UseGuards
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { SuccessResponseDto } from '../common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './user.entity';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { QueryDto } from '../common/dto/query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ CREATE USER (ADMIN ONLY)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return new SuccessResponseDto('User created successfully', user);
  }

  // ✅ LIST USERS (ADMIN ONLY)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(
    @Query() query: QueryDto,
    @Query('isActive') isActive?: string,
  ): Promise<SuccessResponseDto<Pagination<User>>> {

    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    if (isActive !== undefined && !['true', 'false'].includes(isActive)) {
      throw new BadRequestException('Invalid value for "isActive". Use true or false.');
    }

    const activeFilter =
      isActive === undefined ? undefined : isActive === 'true';

    const result = await this.usersService.findAll(query, activeFilter);

    if (!result) {
      throw new InternalServerErrorException('Could not retrieve users');
    }

    return new SuccessResponseDto('Users retrieved successfully', result);
  }

  // ✅ VIEW USER (AUTH REQUIRED)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return new SuccessResponseDto('User retrieved successfully', user);
  }

  // ✅ DELETE USER (ADMIN ONLY)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    if (!user) throw new NotFoundException('User not found');
    return new SuccessResponseDto('User deleted successfully', user);
  }

  // ✅ UPLOAD PROFILE (AUTH REQUIRED)
  @UseGuards(JwtAuthGuard)
  @Put('profile/:id')
  @UseInterceptors(FileInterceptor('profile', {
    storage: diskStorage({
      destination: './public/profile',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Only JPG or PNG files are allowed'), false);
      }
      cb(null, true);
    }
  }))
  async uploadProfile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) throw new BadRequestException('Profile image is required');

    const user = await this.usersService.updateProfile(id, file.filename);

    if (!user) throw new NotFoundException('User not found');

    return new SuccessResponseDto('Profile image updated', user);
  }

  // ✅ UPDATE USER (AUTH REQUIRED)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    if (!user) throw new NotFoundException('User not found');
    return new SuccessResponseDto('User updated successfully', user);
  }
}
