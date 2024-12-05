import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';

export class CreateUserDto {

  @MinLength(3, { message: 'Name Min 3 Character' })
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @MinLength(8, { message: 'Password Min 8 Character' })
  password?: string;

  @IsEnum(UserRole, { message: 'Select Role' })
  @IsOptional()
  role?: UserRole;

  @IsEnum(UserStatus, { message: 'Select Status' })
  @IsOptional()
  status?: UserStatus;

  
}
