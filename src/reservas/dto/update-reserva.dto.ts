import { IsOptional, IsString } from 'class-validator';

export class UpdateReservaDto {
  @IsOptional()
  fecha_reserva?: Date;

  @IsOptional()
  @IsString()
  estado?: string;
}
