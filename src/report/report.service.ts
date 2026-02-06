import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<ReportDocument>,
    private readonly companyService: CompanyService,
  ) {}

  async create(dto: CreateReportDto & { fileUrl: string }): Promise<Report> {
    // Проверяем существование компании
    await this.companyService.findById(dto.companyId);

    // Проверяем на дубликат
    const existingReport = await this.reportModel.findOne({
      companyId: new Types.ObjectId(dto.companyId),
      year: dto.year,
      quarter: dto.quarter,
    });

    if (existingReport) {
      throw new BadRequestException(
        'Report for this company, year and quarter already exists',
      );
    }

    // Создаем отчет со статусом draft по умолчанию
    return this.reportModel.create({
      companyId: new Types.ObjectId(dto.companyId),
      year: dto.year,
      quarter: dto.quarter,
      fileUrl: dto.fileUrl,
      status: 'draft',
    });
  }

  async findByCompanyYearQuarter(
    companyId: string,
    year: number,
    quarter: number,
  ): Promise<Report | null> {
    return this.reportModel.findOne({
      companyId: new Types.ObjectId(companyId),
      year,
      quarter,
    });
  }

  async findReadyReport(
    companyId: string,
    year: number,
    quarter: number,
  ): Promise<Report> {
    const report = await this.reportModel.findOne({
      companyId: new Types.ObjectId(companyId),
      year,
      quarter,
      status: 'draft',
    });

    if (!report) {
      throw new NotFoundException(
        'Ready report not found for this company, year and quarter',
      );
    }

    return report;
  }
}
