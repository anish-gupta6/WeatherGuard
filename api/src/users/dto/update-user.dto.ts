import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Status, Role } from '../schemas/user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
  
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  telegramChatId?: string;
}
