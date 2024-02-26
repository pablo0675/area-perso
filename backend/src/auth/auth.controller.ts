import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginCredentialsDto,
  RegisterCredentialsDto,
} from './dto/Credentials.dto';
import LoginResultDto from './dto/credentialsResponse.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterCredentialsDto })
  @Post('register')
  async register(@Body() registerCredentialsDto: RegisterCredentialsDto) {
    return this.authService.register(registerCredentialsDto);
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
  ): Promise<LoginResultDto> {
    return this.authService.login(loginCredentialsDto);
  }
}
