import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { Libro } from './libros.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Libro])],
  controllers: [LibrosController],
  providers: [LibrosService]
})
export class LibrosModule {}

