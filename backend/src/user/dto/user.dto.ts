import { Language, Theme } from '../entities/user.setting';

export default class UserUpdateDto {
  username!: string;
  email!: string;
  password!: string | null;
  picture!: string | null;
  settings!: { theme: Theme; language: Language }[];
}
