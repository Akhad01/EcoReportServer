import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFilePipeBuilder } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './schemas/report.schema';
import { IsMongoId, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import * as fs from 'fs';

class FindReadyReportQueryDto {
  @IsNotEmpty()
  @IsMongoId()
  companyId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(4)
  @Transform(({ value }) => parseInt(value))
  quarter: number;
}

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  // TODO: Добавить @UseGuards(AdminGuard) когда будет реализована аутентификация
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({ fileType: 'application/pdf' })
        .addMaxSizeValidator({ maxSize: 25 * 1024 * 1024 })
        .build({ fileIsRequired: true }),
    )
    file: Express.Multer.File,
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
    try {
      const fileUrl = `/uploads/${file.filename}`;
      return await this.reportService.create({ ...createReportDto, fileUrl });
    } catch (error) {
      if (file && file.path) {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Error deleting file: ${file.path}`, err);
          }
        });
      }

      throw error;
    }
  }

  @Get('by-company')
  // TODO: Добавить @UseGuards(BotGuard) когда будет реализована аутентификация
  async findReadyReport(
    @Query() query: FindReadyReportQueryDto,
  ): Promise<Report> {
    return this.reportService.findReadyReport(
      query.companyId,
      query.year,
      query.quarter,
    );
  }
}
