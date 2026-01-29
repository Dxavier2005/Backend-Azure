import { IsEmail, IsOptional, MinLength, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../user-role.enum';


export class UpdateUserDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

}
