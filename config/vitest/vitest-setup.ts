import "@testing-library/jest-dom/vitest";
import { vi } from "vite-plus/test";

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

vi.mock("i18next-http-backend");
vi.mock("react-i18next", () => {
  let language = "en";
  return {
    useTranslation: () => ({
      t: (i18nKey: string) => i18nKey,
      i18n: {
        language: language,
        changeLanguage: () => new Promise(() => {}),
        fallbackLng: language,
        resources: {
          en: {},
        },
      },
    }),
    initReactI18next: {
      type: "3rdParty",
      init: () => ({}),
    },
  };
});
