import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from './dto/user.dto';
import { Response } from 'express';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import { User } from './entities/user.entity';

@ApiTags('me')
@Controller('me')
export class MeController {
  constructor(private readonly UserService: UserService) {}

  @ApiBody({ type: UserUpdateDto })
  @ApiOkResponse({ type: String, description: 'success', status: 200 })
  @Post('update')
  async update(
    @Res() res: Response,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<Response> {
    return pipe(
      this.UserService.updateUser(userUpdateDto, userUpdateDto.id),
      TE.fold(
        (error: Error) =>
          T.fromTask(() =>
            Promise.reject(
              new HttpException(error.message, HttpStatus.UNAUTHORIZED),
            ),
          ),
        () =>
          T.fromTask(() =>
            Promise.resolve(res.status(200).send({ message: 'success' })),
          ),
      ),
    )();
  }

  @ApiOkResponse({ type: String, description: 'success', status: 200 })
  @ApiBody({
    type: 'String',
    description: "the user's id",
  })
  @Delete('delete')
  async delete(
    @Res() res: Response,
    @Query('id') id: string,
  ): Promise<Response> {
    return pipe(
      this.UserService.deleteUser({ id }),
      TE.fold(
        (error: Error) =>
          T.fromTask(() =>
            Promise.reject(
              new HttpException(error.message, HttpStatus.UNAUTHORIZED),
            ),
          ),
        () =>
          T.fromTask(() =>
            Promise.resolve(res.status(200).send({ message: 'success' })),
          ),
      ),
    )();
  }

  @ApiBody({
    type: 'String',
    description: "the user's email",
  })
  @ApiOkResponse({ type: User, status: 200 })
  @Get('get')
  async get(@Res() res: Response, @Query('id') id: string): Promise<Response> {
    return pipe(
      this.UserService.getUser({ id }),
      TE.fold(
        (error: Error) =>
          T.fromTask(() =>
            Promise.reject(
              new HttpException(error.message, HttpStatus.UNAUTHORIZED),
            ),
          ),
        (user) => T.fromTask(() => Promise.resolve(res.status(200).send(user))),
      ),
    )();
  }
}
