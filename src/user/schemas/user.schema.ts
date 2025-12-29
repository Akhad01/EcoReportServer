import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  telegramId: number;

  @Prop()
  firstName: string;

  @Prop()
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
