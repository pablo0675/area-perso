import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TokenType } from '../../types/user.token.types';
import { UserEntity } from './user.entity';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TokenType,
  })
  type: TokenType;

  @Column()
  token: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  email?: string;

  @PrimaryColumn()
  userId!: string;
  @ManyToOne(() => UserEntity, (user) => user.tokens, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
