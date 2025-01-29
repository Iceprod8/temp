import { useTranslation } from "react-i18next";

export default function getCurrentLanguage() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  return currentLanguage;
}
