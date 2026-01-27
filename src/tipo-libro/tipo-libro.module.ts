import { Module } from '@nestjs/common';
import { TipoLibroController } from './tipo-libro.controller';
import { TipoLibroService } from './tipo-libro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoLibro } from './tipo-libro.entity';


@Module({
  imports: [TypeOrmModule.forFeature([TipoLibro])],
  controllers: [TipoLibroController],
  providers: [TipoLibroService]
})
export class TipoLibroModule {}
