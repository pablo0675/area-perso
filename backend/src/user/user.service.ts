import { Injectable } from '@nestjs/common';
import { UserModel, UserEntity } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fpts from 'fp-ts';
import UserUpdateDto from './dto/user.dto';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

type UserIdentification = { id: string } | { email: string };
// @ts-ignore
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<typeof UserModel>,
  ) {}

  getUser(
    options: UserIdentification,
  ): fpts.taskEither.TaskEither<Error, typeof UserEntity> {
    return fpts.taskEither.tryCatch(
      () => this.userModel.findOne(options).exec(),
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

  createUser(user: UserEntity): TE.TaskEither<Error, UserEntity> {
    return TE.tryCatch(
      async () => {
        const newUser = new this.userModel(user);
        await newUser.save();
        return newUser.model();
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
