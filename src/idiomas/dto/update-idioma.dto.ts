import { IsOptional, IsString } from 'class-validator';

export class UpdateIdiomaDto {
  @IsOptional()
  @IsString()
  nombre?: string;
}
