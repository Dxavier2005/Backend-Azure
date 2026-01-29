import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateMultaDto {
  @IsOptional()
  @IsNumber()
  monto?: number;

  @IsOptional()
  @IsBoolean()
  pagado?: boolean;
}
