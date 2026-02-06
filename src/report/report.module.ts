import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './schemas/report.schema';
import { CompanyModule } from '../company/company.module';
import { MulterModule } from '@nestjs/platform-express';
import { reportPdfMulterOptions } from './multer.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    CompanyModule,
    MulterModule.register(reportPdfMulterOptions),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
