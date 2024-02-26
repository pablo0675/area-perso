import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { UserService } from '../user/user.service';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { UserEntity } from '../user/entities/user.entity';
import { TaskEither } from 'fp-ts/TaskEither';
import { LoginCredentialsDto } from './dto/Credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  register(registerCredentialsDto: any): TE.TaskEither<Error, UserEntity> {
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
        () => TE.left(new Error('User already exists')),
      ),
    );
  }

  comparePassword = (
    password: string,
    hash: string,
  ): TaskEither<Error, boolean> => {
    return TE.tryCatch(
      () => argon2.verify(password, hash),
      (reason) => new Error(String(reason)),
    );
  };

  generateToken(id: string): string {
    return this.jwtService.sign({ id: id });
  }

  async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
  login(loginCredentialsDto: LoginCredentialsDto): TaskEither<Error, string> {
    return pipe(
      this.UserService.getUser({ email: loginCredentialsDto.email }),
      TE.chain((userOrNull) =>
        userOrNull
          ? TE.right(userOrNull)
          : TE.left(new Error('User not found')),
      ),
      TE.chain((user) =>
        pipe(
          this.comparePassword(
            loginCredentialsDto.password,
            user.password || '',
          ),
          TE.chain((isMatch) =>
            isMatch ? TE.right(user) : TE.left(new Error('Invalid password')),
          ),
        ),
      ),
      TE.map((user) => this.generateToken(user.id)),
    );
  }
}
