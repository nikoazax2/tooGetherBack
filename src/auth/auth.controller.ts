import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { UserLoginPayload } from './payload/user-login.payload';
import { UserRegisterPayload } from './payload/user-register.payload';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  @Post('login')
  async login (@Body() payload: UserLoginPayload) {
    let user = await this.authService.validateUser(payload);
    return await this.authService.createToken(user);
  }

  @Post('register')
  async register (@Body() payload: UserRegisterPayload) {
    let user = await this.usersService.register(payload);


    return user.id
  }
}
