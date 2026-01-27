import { IsOptional, IsString } from 'class-validator';

export class UpdatePrestamoDto {
  @IsOptional()
  fecha_devolucion?: Date;

  @IsOptional()
  @IsString()
  estado?: string;
}
