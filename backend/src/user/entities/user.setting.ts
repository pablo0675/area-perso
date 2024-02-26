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

export default class UserSetting {
  theme: Theme = Theme.Default;
  language: Language = Language.Default;
}
