import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMultaDto {
  @IsString()
  prestamo_id: string;

  @IsNumber()
  monto: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsBoolean()
  pagado?: boolean;
}
