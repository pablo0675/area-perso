import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Area from './area.entity';
import Scope from './scope.entity';

export const SERVICE_NAME = ['riot', 'google', 'github', 'discord'] as const;

export type ServiceName = (typeof SERVICE_NAME)[number];

@Entity()
export default class Service {
  @PrimaryColumn()
  id!: ServiceName;

  @Column()
  imageUrl!: string;

  @Column()
  oauthUrl!: string;

  @OneToMany(() => Area, (area) => area.service)
  areas!: Area[];

  @Column({ default: true, nullable: false })
  needConnection!: boolean;

  @OneToMany(() => Scope, (scope) => scope.service)
  scopes!: Scope[];
}
