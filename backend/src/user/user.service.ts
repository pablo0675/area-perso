import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as fpts from 'fp-ts';
import { UserUpdateDto } from './dto/user.dto';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidv4 } from 'uuid';
import { DeleteResult, Repository } from 'typeorm';
import { hash } from 'argon2';
import { RegisterCredentialsDto } from '../auth/dto/Credentials.dto';

type UserIdentification = { id: string } | { email: string };
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getUser(
    options: UserIdentification,
  ): fpts.taskEither.TaskEither<Error, User> {
    return fpts.taskEither.tryCatch(
      async () => {
        const user = await this.userRepository.findOne({ where: options });
        if (user === null) {
          throw new Error('UserEntity not found');
        }
        return user;
      },
      (error: string) => {
        return new Error(error);
      },
    );
  }

  checkExistingUser(options: { email: string }): TE.TaskEither<Error, boolean> {
    return pipe(
      this.getUser(options),
      TE.map((user) => user !== null),
    );
  }

  createUser(userDto: RegisterCredentialsDto): TE.TaskEither<Error, User> {
    const id = uuidv4();
    const user = this.userRepository.create({
      id: id,
      username: userDto.username,
      email: userDto.email,
      password: userDto.password,
      settings: {
        userId: id,
        theme: 'auto',
        language: 'English',
      },
    });

    return TE.tryCatch(
      async () => {
        if (user && user.password) user.password = await hash(user.password);
        if (user.password === null) {
          throw new Error('Password not hashed');
        }
        const savedUser = await this.userRepository.save(user);
        if (savedUser === null) {
          throw new Error('UserEntity not saved');
        }
        return savedUser;
      },
      (error: unknown) => new Error(String(error)),
    );
  }

  updateUser(
    user: UserUpdateDto,
    id: string,
  ): fpts.taskEither.TaskEither<Error, User> {
    return fpts.taskEither.tryCatch(
      async () => {
        const updatedUser = await this.userRepository.findOne({
          where: { id },
        });
        if (updatedUser === null) {
          throw new Error('UserEntity not found');
        }
        Object.assign(updatedUser, user);
        const savedUser = await this.userRepository.save(updatedUser);
        if (savedUser === null) {
          throw new Error('UserEntity not saved');
        }

        return updatedUser;
      },
      (error: string) => {
        return new Error(error);
      },
    );
  }

  deleteUser(
    options: UserIdentification,
  ): fpts.taskEither.TaskEither<Error, DeleteResult> {
    return fpts.taskEither.tryCatch(
      () => this.userRepository.delete(options),
      (error: string) => {
        return new Error(error);
      },
    );
  }
}
