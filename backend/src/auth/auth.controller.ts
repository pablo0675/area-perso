import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginCredentialsDto,
  RegisterCredentialsDto,
} from './dto/Credentials.dto';
import LoginResultDto from './dto/credentialsResponse.dto';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterCredentialsDto })
  @Post('register')
  async register(@Body() registerCredentialsDto: RegisterCredentialsDto) {
    return pipe(
      this.authService.register(registerCredentialsDto),
      TE.fold(
        (error: Error) =>
          T.fromTask(() =>
            Promise.reject(
              new HttpException(error.message, HttpStatus.UNAUTHORIZED),
            ),
          ),
        (user) => T.fromTask(() => Promise.resolve(user)),
      ),
    )();
  }

  @ApiBody({ type: LoginCredentialsDto })
  @ApiResponse({
    status: 200,
    description:
      'The JWT access token for the user, only available for 5 Hours',
    type: LoginResultDto,
  })
  @Post('login')
  async login(
    @Body() loginCredentialsDto: LoginCredentialsDto,
  ): Promise<LoginCredentialsDto> {
    return pipe(
      this.authService.login(loginCredentialsDto),
      TE.fold(
        (error: Error) =>
          T.fromTask(() =>
            Promise.reject(
              new HttpException(error.message, HttpStatus.UNAUTHORIZED),
            ),
          ),
        (token: string[]) =>
          T.fromTask(() =>
            Promise.resolve(token as unknown as LoginCredentialsDto),
          ),
      ),
    )();
  }

  @ApiBody({ type: String, description: 'The token to verify' })
  @ApiOkResponse({
    type: String,
    description: 'The token is valid',
    status: 200,
  })
  @Post('verify')
  async verify(@Body() token: string) {
    const result = await this.authService.verifyToken(token);
    if (result === null) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return result;
  }
}
