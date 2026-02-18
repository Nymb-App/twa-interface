import { useState } from "react";
import { useTranslation } from "react-i18next";

const SUPPORTED = ["en", "ru"] as const;
type Lang = (typeof SUPPORTED)[number];

function normalizeLang(lng?: string): Lang {
    if (!lng) return "en";
    const base = lng.split("-")[0]; // en-US -> en
    return (SUPPORTED as readonly string[]).includes(base) ? (base as Lang) : "en";
}

export function LangSwitch() {
    const { i18n } = useTranslation(); // важно: подписка на обновления
    const [isChanging, setIsChanging] = useState(false);

    const lang = normalizeLang(i18n.resolvedLanguage ?? i18n.language);

    return (
        <button
            type="button"
            className="inline-flex items-center justify-between bg-[#1d1f1d] rounded-2xl h-10 px-2.5 cursor-pointer active:bg-[#1d1f1d]/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isChanging}
            onClick={async () => {
                if (isChanging) return;

                const newLang: Lang = lang === "en" ? "ru" : "en";
                try {
                    setIsChanging(true);
                    await i18n.changeLanguage(newLang); // дождаться реальной смены
                    // если хочешь явно сохранять:
                    localStorage.setItem("lang", newLang);
                } finally {
                    setIsChanging(false);
                }
            }}
        >
            <span className="font-inter font-semibold text-base">
                {lang.toUpperCase()}
            </span>
        </button>
    );
}
