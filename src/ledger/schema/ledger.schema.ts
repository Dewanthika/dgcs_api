import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { Company } from 'src/company/schema/company.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/schema/user.schema';
export type LedgerDocument = Ledger & Document;
@Schema({ timestamps: true })
export class Ledger extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: Company.name }) companyID:
    | CreateCompanyDto
    | Types.ObjectId;
  @Prop({ required: true, type: Types.ObjectId, ref: User.name }) userID:
    | CreateUserDto
    | Types.ObjectId;
  @Prop() transactionType: string;
  @Prop() transactionDate: Date;
  @Prop() description: string;
  @Prop() amount: number;
}
export const LedgerSchema = SchemaFactory.createForClass(Ledger);
