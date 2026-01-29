import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIdiomaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  codigo?: string;
}
