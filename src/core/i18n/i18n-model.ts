export const Language = {
  en: "en",
  es: "es",
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export const DefaultNamespace = "translation" as const;
