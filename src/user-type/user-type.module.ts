import { Module } from '@nestjs/common';
import { UserTypeService } from './user-type.service';
import { UserTypeController } from './user-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserType, UserTypeSchema } from './schema/user-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserType.name, schema: UserTypeSchema },
    ]),
  ],
  controllers: [UserTypeController],
  providers: [UserTypeService],
})
export class UserTypeModule {}
