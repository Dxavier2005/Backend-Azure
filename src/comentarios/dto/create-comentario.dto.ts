import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComentarioDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  contenido: string;
}
