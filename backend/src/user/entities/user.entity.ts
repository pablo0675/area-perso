import { Schema, model } from 'mongoose';
import UserSetting from './user.setting';
const argon2 = require('argon2');

enum TokenType {
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

export class UserToken {
  type: TokenType;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  username?: string;
  email?: string;
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
  tokens: UserToken[];
  accessToken?: string;
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
});

export const userSchema = new Schema<UserEntity>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  picture: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  settings: { type: [UserSettingSchema] },
  tokens: { type: [tokenTypeSchema], default: [] },
  accessToken: { type: String, required: false },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    console.log('password modified');
    try {
      this.password = await argon2.hash(this.password);
    } catch (error) {
      console.error('yolo');
      throw new Error(error);
    }
  }
  next();
});

export const UserModel = model<UserEntity>('User', userSchema);
