import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from 'src/company/schema/company.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  fName: string;

  @Prop({ required: true })
  lName: string;

  @Prop()
  DOB: Date;

  @Prop()
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  district: string;

  @Prop()
  postal_code: string;

  @Prop()
  companyName?: string;

  @Prop()
  businessRegNo?: string;

  @Prop()
  businessRegImage?: string; // Storing the file path or URL

  @Prop({ type: Types.ObjectId, required: false, ref: Company.name })
  companyID: Types.ObjectId;

  @Prop({ type: String, required: true })
  userType: string;

  @Prop({ default: Date.now })
  joinedDate: Date;

  @Prop()
  status: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
