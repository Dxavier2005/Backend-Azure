import { Module } from '@nestjs/common';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from './prestamos.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Prestamo])],
  controllers: [PrestamosController],
  providers: [PrestamosService]
})
export class PrestamosModule {}
