import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import Service from './service.entity';

@Entity()
export default class Scope {
  @PrimaryColumn()
  id!: string;

  @OneToOne(() => Service, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  service!: Service;
}
