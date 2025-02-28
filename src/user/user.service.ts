import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from 'utils/auth.util';
import { Permissions } from 'constant/permission.enum';
import { UserType } from 'src/user-type/schema/user-type.schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserType.name) private readonly userTypeModel: Model<UserType>,
  ) {
    this.createAdmin();
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const email = createUserDto.email;
      const userRes = await this.findByEmail(email);
      if (!userRes) {
        this.logger.error(`User with email ${email} already exists`);
        return null;
      }
      const password = createUserDto.password || '0000';
      const hash = await hashPassword(password);

      const user = await this.userModel.create({
        ...createUserDto,
        password: hash,
      });

      this.logger.log('new user created');

      return user;
    } catch (error) {
      this.logger.error('error while creating user' + error.message);
      return null;
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        this.logger.error(`User with email ${email} not found`);
        return null;
      }
      return user;
    } catch (error) {
      this.logger.error(error.message, 'UserService.findByEmail');
      return error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // Helpers
  private async createAdmin() {
    const adminUser = await this.findByEmail('admin@mailtor.com');

    if (adminUser) {
      return;
    }

    const hash = await hashPassword('Pa$$word');

    const role = await this.userTypeModel.create({
      userRole: 'admin',
      permissions: [
        Permissions.READ,
        Permissions.CREATE,
        Permissions.DELETE,
        Permissions.UPDATE,
      ],
    });

    await this.userModel.create({
      fName: 'admin',
      lame: 'admin',
      email: 'admin@mailtor.com',
      password: hash,
      role: role._id,
    });
  }
}
