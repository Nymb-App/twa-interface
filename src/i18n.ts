import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

// Vite: подхватываем ВСЕ json из /locales
const localeModules = import.meta.glob("./locales/*.json");

i18n
    .use(
        resourcesToBackend((language: string) => {
            const key = `./locales/${language}.json`;
            const loader = localeModules[key];

            if (!loader) {
                return Promise.reject(new Error(`Missing locale file: ${key}`));
            }

            return loader() as Promise<any>;
        })
    )
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        supportedLngs: ["en", "ru"],

        // у нас один namespace по умолчанию
        ns: ["translation"],
        defaultNS: "translation",

        interpolation: { escapeValue: false },

        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
            lookupLocalStorage: "lang",
        },

        react: { useSuspense: true },
    });

export default i18n;
