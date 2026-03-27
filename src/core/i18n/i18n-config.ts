import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { DefaultNamespace, Language } from "./i18n-model";
import HttpApi from "i18next-http-backend";

i18n.use(initReactI18next);
i18n.use(HttpApi);
i18n.use(LanguageDetector);

void i18n.init({
  backend: {
    loadPath: "locales/{{lng}}/{{ns}}.json",
    requestOptions: {
      cache: "no-cache",
    },
  },
  debug: true,
  supportedLngs: Object.values(Language),
  fallbackLng: Language.en,
  ns: [DefaultNamespace],
  defaultNS: DefaultNamespace,
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
