import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMensajeDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  mensaje: string;
}
