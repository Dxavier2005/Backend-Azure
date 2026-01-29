import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoriesDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  descripcion?: string;
}
