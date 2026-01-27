import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTipoLibroDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
