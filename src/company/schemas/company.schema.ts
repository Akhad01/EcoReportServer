import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, unique: true, index: true })
  inn: string;

  @Prop()
  name: string;

  @Prop()
  address: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
