import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
  ) {
    const JWT_KEY = configService.get<string>('JWT_KEY');
    if (JWT_KEY === undefined) {
      throw new Error('JWT_KEY is undefined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_KEY,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await UserModel.findOne({ email: payload.mail });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
