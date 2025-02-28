import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permissions } from 'constant/permission.enum';
import { Document } from 'mongoose';

export type UserTypeDocument = UserType & Document;

@Schema({ timestamps: true })
export class UserType extends Document {
  @Prop({ required: true })
  userRole: string;

  @Prop({
    type: [String],
    enum: Object.values(Permissions),
    required: true,
    default: [],
  })
  permission: Permissions[];
}

export const UserTypeSchema = SchemaFactory.createForClass(UserType);
