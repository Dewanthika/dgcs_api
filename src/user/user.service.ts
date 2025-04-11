import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from 'utils/auth.util';
import UserRole from 'constant/UserRole.enum';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
    private readonly fileService: FilesService,
  ) {
    this.createAdmin();
  }

  async create(
    createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let user: UserDocument;
    try {
      const existingUser = await this.usersModel.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new ConflictException(
          `Email "${createUserDto.email}" already exists`,
        );
      }

      const hashedPassword = await hashPassword(createUserDto.password);
      let businessRegImageUrl = '';

      if (file) {
        try {
          const uploadResult = await this.fileService.uploadFile(file);
          if ('secure_url' in uploadResult) {
            businessRegImageUrl = uploadResult.secure_url;
          } else {
            throw new Error('File upload failed');
          }
        } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
          throw new Error('File processing failed');
        }
      }

      user = await this.usersModel.create({
        fName: createUserDto.fName,
        lName: createUserDto.lName,
        email: createUserDto.email,
        phone: createUserDto.phone,
        DOB: new Date(createUserDto.DOB || Date.now()),
        city: createUserDto.city,
        state: createUserDto.district,
        status: createUserDto.status || 'active',
        postalCode: createUserDto.postal_code,
        address: createUserDto.address,
        password: hashedPassword,
        companyID: createUserDto.companyID || null,
        userType: createUserDto.userType,
        companyName: createUserDto.companyName || '',
        businessRegNo: createUserDto.businessRegNo || '',
        businessRegImage: businessRegImageUrl,
        joinedDate: new Date(),
      });
    } catch (error) {
      throw new ConflictException(`Error creating user: ${error.message}`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    try {
      const user = await this.usersModel.findOne({ email }).exec();
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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<User> {
    // Find the existing user
    const existingUser = await this.usersModel.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  
    let businessRegImageUrl = existingUser.businessRegImage;
  
    if (file) {
      try {
        const uploadResult = await this.fileService.uploadFile(file);
        if ('secure_url' in uploadResult) {
          businessRegImageUrl = uploadResult.secure_url;
        } else {
          throw new Error('File upload failed');
        }
      } catch (error) {
        this.logger.error('Error uploading image during update:', error.message);
        throw new ConflictException('File processing failed during update');
      }
    }
  
    const updatedUser = await this.usersModel.findByIdAndUpdate(
      id,
      {
        ...updateUserDto,
        businessRegImage: businessRegImageUrl,
      },
      { new: true, runValidators: true },
    );
  
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return updatedUser;
  }
  

  async remove(id: string): Promise<void> {
    const result = await this.usersModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  // Helpers
  private async createAdmin() {
    const adminUser = await this.findByEmail('admin@mailinator.com');

    if (adminUser) {
      return;
    }

    const hash = await hashPassword('Test@1234');

    await this.usersModel.create({
      fName: 'admin',
      lName: 'admin',
      email: 'admin@mailinator.com',
      password: hash,
      userType: UserRole.ADMIN,
    });
  }
}
