import React from "react";
import { useTranslation } from "react-i18next";

// Swich for website translation

// Usage:
// import LanguageSwitcher from "./common/LanguageSwitcher";
//
// const locales = {
//   en: { title: "English" },
//   fr: { title: "Français" },
// };
// .....
// <LanguageSwitcher locales={locales} /> */}

export default function LanguageSwitcher({ locales }) {
  const { t: translation, i18n } = useTranslation();
  return (
    <div>
      <ul>
        {Object.keys(locales).map((locale) => (
          <li key={locale}>
            <button
              style={{
                fontWeight:
                  i18n.resolvedLanguage === locale ? "bold" : "normal",
              }}
              type="submit"
              onClick={() => i18n.changeLanguage(locale)}
            >
              {locales[locale].title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
