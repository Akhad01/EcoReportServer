import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTelegramUserDto {
  @IsNumber()
  telegramId: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  username?: string;
}
