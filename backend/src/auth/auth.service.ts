import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { User } from '../user/entities/user.entity';
import { TaskEither } from 'fp-ts/TaskEither';
import { LoginCredentialsDto } from './dto/Credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const argon2 = require('argon2');

@Injectable()
export class AuthService {
  constructor(
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  register(registerCredentialsDto: any): TE.TaskEither<Error, User> {
    return pipe(
      this.UserService.getUser({
        email: registerCredentialsDto.email,
      }),
      TE.fold(
        (error) => {
          if (error) {
            return this.UserService.createUser(registerCredentialsDto);
          }
          return TE.left(error);
        },
        () => TE.left(new Error('UserEntity already exists')),
      ),
    );
  }

  comparePassword = (
    password: string,
    hash: string,
  ): TE.TaskEither<Error, void> => {
    return pipe(
      TE.tryCatch(
        () => argon2.verify(hash, password),
        (reason: string) =>
          new Error(
            `Technical error while verifying password : ${String(reason)}`,
          ),
      ),
      TE.chain((isMatch) =>
        isMatch
          ? TE.right(undefined)
          : TE.left(new Error('Wrong password provided')),
      ),
    );
  };

  generateToken(id: string): string {
    return this.jwtService.sign({ id: id });
  }

  async verifyToken(token: string): Promise<null | JwtPayload> {
    try {
      return this.jwtService.verify(token) as JwtPayload;
    } catch {
      return null;
    }
  }
  login(loginCredentialsDto: LoginCredentialsDto): TaskEither<Error, string[]> {
    return pipe(
      this.UserService.getUser({ email: loginCredentialsDto.email }),
      TE.chain((user) =>
        pipe(
          this.comparePassword(
            loginCredentialsDto.password,
            user.password || '',
          ),
          TE.map(() => user),
        ),
      ),
      TE.map((user) => [this.generateToken(user.id), user.id]),
    );
  }
}
