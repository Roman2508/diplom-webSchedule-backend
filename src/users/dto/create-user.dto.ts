import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Мінімальна довжина паролю 6 символів' })
  @IsString()
  password: string;

  @MinLength(3, { message: 'Мінімальна довжина 3 символа' })
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  access?: 'super_admin' | 'admin' | 'deans_office' | 'department_chair';
  
  @IsOptional()
  @IsNumber()
  department?: number;
}
