import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permissions } from 'constant/permission.Enum';
import { Document } from 'mongoose';
export type UserTypeDocument = UserType & Document;
@Schema({ timestamps: true })
export class UserType extends Document {
  @Prop({ required: true }) userTypeID: string;
  @Prop({ required: true }) userRole: string;
  @Prop({ required: true, default: [String], enum: Permissions })
  permission: Permissions[];
}
export const UserTypeSchema = SchemaFactory.createForClass(UserType);
