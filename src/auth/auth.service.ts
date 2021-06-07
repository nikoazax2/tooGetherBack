import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserLoginPayload } from './payload/user-login.payload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser (payload: UserLoginPayload): Promise<any> {
    const user = await this.usersService.getByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
    if (bcrypt.compareSync(payload.password, user.password)) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials!');
  }

  async createToken (user: User) {
    return { payload: { access_token: this.jwtService.sign({ id: user.id }, { expiresIn: "4h" }) }, user }
  }
}
