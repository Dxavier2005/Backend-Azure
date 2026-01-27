import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEstadoLibroDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
