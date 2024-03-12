import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TokenDto {
  @ApiProperty({ example: 'Google' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'token_string' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'refresh_token_string' })
  @IsString()
  refreshToken?: string;

  @ApiProperty({ example: new Date().toISOString() })
  expiresAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: 'username' })
  @IsString()
  username?: string;

  @ApiProperty({ example: 'email@example.com' })
  @IsEmail()
  email?: string;
}

class UserSettingDto {
  @ApiProperty({ example: 0 })
  theme: number;

  @ApiProperty({ example: 0 })
  language: number;
}

export class UserUpdateDto {
  @ApiProperty({ example: '123' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 'username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'email@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'password', required: false })
  @IsOptional()
  @IsString()
  password?: string | null;

  @ApiProperty({ example: 'picture_url', required: false })
  @IsOptional()
  @IsString()
  picture?: string | null;

  @ApiProperty({ type: UserSettingDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSettingDto)
  settings?: UserSettingDto;

  @ApiProperty({ type: [TokenDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TokenDto)
  tokens?: TokenDto[];
}
