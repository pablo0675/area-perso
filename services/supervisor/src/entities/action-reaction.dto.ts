import { IsNotEmpty, IsObject, IsString } from 'class-validator';

class actionDto {
  @IsString()
  @IsNotEmpty()
  actionId: string;

  @IsObject()
  params: Record<string, any>;
}