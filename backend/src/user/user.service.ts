import { Injectable } from '@nestjs/common';
import { UserModel, UserEntity, UserToken } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fpts from 'fp-ts';
import UserUpdateDto from './dto/user.dto';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidv4 } from 'uuid';

type UserIdentification = { id: string } | { email: string };
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<typeof UserModel>,
  ) {}

  getUser(
    options: UserIdentification,
  ): fpts.taskEither.TaskEither<Error, UserEntity> {
    return fpts.taskEither.tryCatch(
      async () => {
        const user = await UserModel.findOne(options).exec();
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
    const user = await UserModel.findOne({ id: id }).exec();

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

    await user.save();

    return user.toObject() as UserEntity;
  }

  checkExistingUser(options: { email: string }): TE.TaskEither<Error, boolean> {
    return pipe(
      this.getUser(options),
      TE.map((user) => user !== null),
    );
  }

  createUser(user: UserEntity): TE.TaskEither<Error, UserEntity> {
    const createdAt = new Date();
    const updatedAt = new Date();
    const id = uuidv4();
    user = { ...user, createdAt, updatedAt, id };
    console.log(user);
    return TE.tryCatch(
      async () => {
        const newUser = new this.userModel(user);
        await newUser.save();
        return newUser.toObject();
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
        const updatedUser = await this.userModel
          .findByIdAndUpdate(id, user)
          .exec();
        if (updatedUser === null) {
          throw new Error('User not found');
        }
        return updatedUser.model();
      },
      (error: string) => {
        return new Error(error);
      },
    );
  }

  deleteUser(
    options: UserIdentification,
  ): fpts.taskEither.TaskEither<Error, typeof UserModel> {
    return fpts.taskEither.tryCatch(
      () => this.userModel.findOneAndDelete(options).exec(),
      (error: string) => {
        return new Error(error);
      },
    );
  }
}
