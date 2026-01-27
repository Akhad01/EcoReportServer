import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    const exists = await this.companyModel.findOne({ inn: dto.inn });

    if (exists) {
      throw new BadRequestException('Company with this INN already exists');
    }

    return this.companyModel.create(dto);
  }

  async findByInn(inn: string): Promise<Company> {
    const company = await this.companyModel.findOne({ inn });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async findById(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }
}
