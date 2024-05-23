import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export const PARAMS_TYPES = [
  'email',
  'text',
  'integer',
  'array',
  'boolean',
] as const;

export class Param {
  @ApiProperty({
    description: 'the parameters type (email, text, integer, array, boolean)',
    enum: PARAMS_TYPES,
  })
  @IsEnum(PARAMS_TYPES)
  type!: (typeof PARAMS_TYPES)[number];

  @ApiProperty({
    description: 'the parameters name',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'optional or not',
  })
  @IsBoolean()
  optional!: boolean;

  @ApiProperty({
    description: 'value of the parameter',
  })
  @IsOptional()
  @IsArray()
  value?: string[];
}

export class AreaDto {
  @ApiProperty({
    description: 'The areas id',
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'The areas parameters',
    type: [Param],
  })
  @IsArray()
  @Type(() => Param)
  params!: Param[];

  @ApiProperty({
    description: 'The areas description',
  })
  @IsString()
  description!: string;
}
