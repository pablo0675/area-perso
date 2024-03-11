export const THEMES = ['Light', 'Dark', 'auto'] as const;
export type Theme = (typeof THEMES)[number];

export const LANGUAGES = ['English', 'Spanish', 'French'] as const;
export type Language = (typeof LANGUAGES)[number];
