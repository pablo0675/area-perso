import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export default class LoginResultDto {
  @ApiProperty({
    description:
      'The JWT access token for the user, only available for 5 Hours',
  })
  @IsJWT()
  accessToken!: string;
}
