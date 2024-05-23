import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

import { Language, Theme, LANGUAGES, THEMES } from '../../types/user.settings';

@Entity('user_settings')
export class UserSettings {
  @PrimaryColumn('uuid')
  userId!: string;
  @OneToOne(() => User, (user) => user.settings, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'enum', enum: THEMES, default: 'auto' })
  theme: Theme;

  @Column({ type: 'enum', enum: LANGUAGES, default: 'English' })
  language: Language;
}
