import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { UserService } from '../user/user.service';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { UserEntity } from '../user/entities/user.entity';
import { TaskEither } from 'fp-ts/TaskEither';

@Injectable()
export class AuthService {
  constructor(private readonly UserService: UserService) {}

  register(registerCredentialsDto: any): TaskEither<Error, UserEntity> {
    return pipe(
      this.UserService.checkExistingUser({
        email: registerCredentialsDto.email,
      }),
      TE.chain((exists) =>
        exists
          ? TE.left(new Error('User already exists'))
          : this.UserService.createUser(registerCredentialsDto),
      ),
    );
  }
}
