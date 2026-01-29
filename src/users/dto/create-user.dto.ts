import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../user-role.enum';


export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
