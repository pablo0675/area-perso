import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceName } from './service.entity';
import { Param } from '../dto/area.create.dto';
import Service from './service.entity';

@Entity()
export default class Area {
  @ApiProperty({
    description: 'The name of the area',
  })
  @IsNotEmpty()
  @PrimaryColumn()
  id!: string;

  @PrimaryColumn()
  serviceId!: ServiceName;
  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  service!: Service;

  @ApiProperty({
    description: 'action or reaction',
  })
  @Column()
  isAction!: boolean;

  @ApiProperty()
  @Column({ type: 'jsonb', default: [] })
  params!: Param[];

  @ApiProperty()
  @Column({ array: true, type: 'text', default: [] })
  returnParams!: string[];

  @ApiProperty()
  @Column({ default: 'description of the area' })
  description!: string;
}
