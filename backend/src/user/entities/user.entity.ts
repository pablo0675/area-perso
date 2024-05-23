import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserSettings } from './user-setting.entity';

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
}
