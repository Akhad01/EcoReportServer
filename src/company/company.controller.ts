import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @Get('by-inn/:inn')
  findById(@Param('inn') inn: string) {
    return this.companyService.findByInn(inn);
  }
}
