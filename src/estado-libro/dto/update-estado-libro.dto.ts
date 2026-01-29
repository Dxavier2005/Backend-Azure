import { IsOptional, IsString } from 'class-validator';

export class UpdateEstadoLibroDto {
  @IsOptional()
  @IsString()
  nombre?: string;
}
