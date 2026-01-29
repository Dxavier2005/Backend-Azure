import { Module } from '@nestjs/common';
import { IdiomasController } from './idiomas.controller';
import { IdiomasService } from './idiomas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idioma } from './idiomas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idioma])],
  controllers: [IdiomasController],
  providers: [IdiomasService]
})
export class IdiomasModule {}
