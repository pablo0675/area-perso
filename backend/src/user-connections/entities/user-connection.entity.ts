import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import Service from '../../service/entities/service.entity';
import Scope from '../../service/entities/scope.entity';
import { ServiceName } from '../../service/entities/service.entity';
@Entity()
export default class UserConnection {
  @PrimaryColumn()
  userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @PrimaryColumn()
  serviceId!: ServiceName;
  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  service!: Service;

  @ManyToMany(() => Scope, { onDelete: 'CASCADE' })
  @JoinTable()
  scopes!: Scope[];

  @Column({ type: 'jsonb' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data!: any;

  @CreateDateColumn()
  createdAt!: Date;
}
