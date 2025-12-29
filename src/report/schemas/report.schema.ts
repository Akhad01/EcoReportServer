import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, min: 1, max: 4 })
  quarter: number;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ enum: ['ready', 'draft'], default: 'draft' })
  status: 'ready' | 'draft';
}

export const ReportSchema = SchemaFactory.createForClass(Report);

ReportSchema.index(
  {
    companyId: 1,
    year: 1,
    quarter: 1,
  },
  {
    unique: true,
  },
);
