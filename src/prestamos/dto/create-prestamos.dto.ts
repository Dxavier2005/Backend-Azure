import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePrestamoDto {
  @IsString()
  usuario_id: string;

  @IsString()
  libro_id: string;

  @IsNotEmpty()
  fecha_prestamo: Date;

  @IsOptional()
  fecha_devolucion?: Date;

  @IsString()
  estado: string;
}
