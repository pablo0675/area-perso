import { Column, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

export enum Theme {
  Light,
  Dark,
  Default = Light,
}

export enum Language {
  English,
  Spanish,
  French,
  Default = English,
}

export default class UserSettings {
  @Column({ type: 'enum', enum: Theme, default: Theme.Default })
  theme: Theme;

  @Column({ type: 'enum', enum: Language, default: Language.Default })
  language: Language;

  @PrimaryColumn()
  userId!: string;
  @OneToOne(() => UserEntity, (user) => user.settings, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
