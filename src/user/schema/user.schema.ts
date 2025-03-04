import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserType } from 'src/user-type/schema/user-type.schema';
import { Company } from 'src/company/schema/company.schema';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { CreateUserTypeDto } from 'src/user-type/dto/create-user-type.dto';

export type UserDocument = User & Document;

@Schema({ timestamps: false, _id: false })
export class Address {
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  state: string;
  @Prop({ required: true })
  postalCode: string;
}
export const AddressSchema = SchemaFactory.createForClass(Address);

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

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop()
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId, required: false, ref: Company.name })
  companyID: CreateCompanyDto | Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: UserType.name })
  userTypeID: CreateUserTypeDto | Types.ObjectId;

  @Prop({ default: Date.now })
  joinedDate: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
