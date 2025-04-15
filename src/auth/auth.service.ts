import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isPasswordMatch } from 'utils/auth.util';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    const isMatch = user && (await isPasswordMatch(pass, user?.password));

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.userType,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    try {
      const user = await this.userService.create(createUserDto, file);
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      return null;
    }
  }
}
