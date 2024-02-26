import { Schema, model } from 'mongoose';
import UserSetting from './user.setting';
import argon2 from 'argon2';

enum TokenType {
  Area,
  Google,
  Facebook,
  Twitter,
  Github,
  riot,
  microsoft,
  discord,
  spotify,
  twitch,
  linkedin,
  instagram,
}

class UserToken {
  type: TokenType;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  username: string;
  email: string;
  toLogin: boolean;
}

export class UserEntity {
  id!: string;
  username!: string;
  email!: string;
  password!: string | null;
  picture!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  settings!: UserSetting[];
  tokens?: UserToken[];
}

const UserSettingSchema = new Schema<UserSetting>({
  theme: { type: Number, default: 0 },
  language: { type: Number, default: 0 },
});

const tokenTypeSchema = new Schema<UserToken>({
  type: { type: Number, required: true },
  token: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  username: { type: String, required: true },
  email: { type: String, required: true },
  toLogin: { type: Boolean, default: false },
});


const userSchema = new Schema<UserEntity>({
  id: { type: String, required: true, unique: true},
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  picture: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  settings: { type: [UserSettingSchema], default: [] },
  tokens: { type: [tokenTypeSchema], default: [] },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password);
  }
  next();
});

export const UserModel = model<UserEntity>('User', userSchema);
