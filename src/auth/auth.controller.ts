import { Body, Controller, Post } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { Permission } from './decorators/permission.decorator';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
  @Public()
  @Permission()
  @Post('login')
  signIn(@Body() signInDto: AuthDto) {
    console.log('hello')
    return this.authService.login(signInDto.email, signInDto.password);
  }
}
