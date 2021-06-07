import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate ({ iat, exp, id }, done) {
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException('Token expired');
    }

    const user = await this.usersService.getById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    done(null, user.getJSON());
  }
}
