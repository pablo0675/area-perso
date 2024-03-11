import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { pipe } from 'fp-ts/function';
import * as fpts from 'fp-ts';

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
    return pipe(
      this.usersService.getUser({ id: payload.id }),
      fpts.taskEither.match(
        (error) => {
          return new UnauthorizedException(error.message);
        },
        (user) => {
          if (user === null) {
            return new UnauthorizedException('User not found');
          } else {
            return user;
          }
        },
      ),
    );
  }
}
