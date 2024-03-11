import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import UserSetting from './user.setting';
import { UserToken } from './user.token';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  password!: string | null;

  @Column({ nullable: true })
  picture!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => UserSetting, (setting) => setting.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  settings!: UserSetting[];

  @OneToMany(() => UserToken, (token) => token.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tokens: UserToken[];

  @Column({ nullable: true })
  accessToken?: string;
}
