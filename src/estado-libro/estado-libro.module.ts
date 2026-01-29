import { Module } from '@nestjs/common';
import { EstadoLibroController } from './estado-libro.controller';
import { EstadoLibroService } from './estado-libro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoLibro } from './estado-libro.entity';


@Module({
  imports: [TypeOrmModule.forFeature([EstadoLibro])],
  controllers: [EstadoLibroController],
  providers: [EstadoLibroService]
})
export class EstadoLibroModule {}
