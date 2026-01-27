import { Module } from '@nestjs/common';
import { EditorialesController } from './editoriales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Editorial } from './editorial.entity';
import { EditorialesService } from './editoriales.service';


@Module({
  imports: [TypeOrmModule.forFeature([Editorial])],
  controllers: [EditorialesController],
  providers: [EditorialesService]
})
export class EditorialesModule {}
