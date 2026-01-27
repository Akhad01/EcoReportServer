import { IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  inn: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
