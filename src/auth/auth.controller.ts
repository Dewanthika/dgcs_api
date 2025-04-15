import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('login')
  signIn(@Body() signInDto: AuthDto) {
    return this.authService.login(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.register(createUserDto, file);
  }
}
