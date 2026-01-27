import { IsOptional, IsString } from 'class-validator';

export class UpdateTipoLibroDto {
  @IsOptional()
  @IsString()
  nombre?: string;
}
