import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PurchaseDocument = HydratedDocument<Purchase>;

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Report', required: true })
  reportId: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'UZS' })
  currency: string;

  @Prop()
  provider: string;

  @Prop()
  providerPaymentId: string;

  @Prop({ enum: ['pending', 'paid', 'failed'], required: true })
  status: 'pending' | 'paid' | 'failed';
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
