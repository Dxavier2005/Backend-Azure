import { IsOptional, IsString } from 'class-validator';

export class UpdateMensajeDto {
  @IsOptional()
  @IsString()
  mensaje?: string;
}
