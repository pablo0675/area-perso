import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserSettings } from './user-setting.entity';
import { UserToken } from './user-token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  picture?: string;


  @OneToOne(() => UserSettings, (settings) => settings.user, {
    cascade: true,
    nullable: false,
  })
  settings!: UserSettings;

  @OneToMany(() => UserToken, (token) => token.user, {
    cascade: true,
    nullable: true,
  })
  tokens: UserToken[];
}
