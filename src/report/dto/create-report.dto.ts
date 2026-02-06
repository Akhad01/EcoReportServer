import { IsMongoId, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReportDto {
  @IsNotEmpty()
  @IsMongoId()
  companyId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  @Transform(({ value }) => parseInt(value, 10))
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(4)
  @Transform(({ value }) => parseInt(value, 10))
  quarter: number;
}
