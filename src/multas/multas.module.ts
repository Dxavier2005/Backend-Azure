import { Module } from '@nestjs/common';
import { MultasController } from './multas.controller';
import { MultasService } from './multas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Multa } from './multa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Multa])],
  controllers: [MultasController],
  providers: [MultasService]
})
export class MultasModule {}
