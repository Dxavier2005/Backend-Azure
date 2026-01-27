import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateLibroDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  autor?: string;

  @IsOptional()
  @IsNumber()
  anio_publicacion?: number;

  @IsOptional()
  @IsNumber()
  numero_paginas?: number;

  @IsOptional()
  @IsNumber()
  cantidad_disponible?: number;

  @IsOptional()
  @IsString()
  categoria_id?: string;

  @IsOptional()
  @IsString()
  editorial_id?: string;

  @IsOptional()
  @IsString()
  idioma_id?: string;

  @IsOptional()
  @IsString()
  tipo_libro_id?: string;

  @IsOptional()
  @IsString()
  estado_id?: string;
}
