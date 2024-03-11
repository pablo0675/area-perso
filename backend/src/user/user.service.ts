import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserToken } from './entities/user.token';
import * as fpts from 'fp-ts';
import { UserUpdateDto } from './dto/user.dto';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidv4 } from 'uuid';
import { DeleteResult, Repository } from 'typeorm';
import { hash } from 'argon2';

type UserIdentification = { id: string } | { email: string };
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  getUser(
    options: UserIdentification,
  ): fpts.taskEither.TaskEither<Error, UserEntity> {
    return fpts.taskEither.tryCatch(
      async () => {
        const user = await this.userRepository.findOne({ where: options });
        if (user === null) {
          throw new Error('User not found');
        }
        return user;
      },
      (error: string) => {
        return new Error(error);
      },
    );
  }

  async storeToken(token: UserToken, id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['tokens'],
    });

    if (!user) {
      throw new Error('User not found');
    }
    const existingTokenIndex = user.tokens.findIndex(
      (t) => t.type === token.type,
    );

    if (existingTokenIndex > -1) {
      user.tokens[existingTokenIndex] = token;
    } else {
      user.tokens.push(token);
    }

    await this.userRepository.save(user);

    return user;
  }

  checkExistingUser(options: { email: string }): TE.TaskEither<Error, boolean> {
    return pipe(
      this.getUser(options),
      TE.map((user) => user !== null),
    );
  }

  createUser(userDto: UserEntity): TE.TaskEither<Error, UserEntity> {
    const createdAt = new Date();
    const updatedAt = new Date();
    const id = uuidv4();
    const user = this.userRepository.create({
      ...userDto,
      id,
      createdAt,
      updatedAt,
    });
    return TE.tryCatch(
      async () => {
        user.password = await hash(user.password);
        const savedUser = await this.userRepository.save(user);
        return savedUser;
      },
      (error: unknown) => new Error(String(error)),
    );
  }

  updateUser(
    user: UserUpdateDto,
    id: string,
  ): fpts.taskEither.TaskEither<Error, UserEntity> {
    return fpts.taskEither.tryCatch(
      async () => {
        const updatedUser = await this.userRepository.findOne({
          where: { id },
        });
        if (updatedUser === null) {
          throw new Error('User not found');
        }
        Object.assign(updatedUser, user);
        await this.userRepository.save(updatedUser);
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
