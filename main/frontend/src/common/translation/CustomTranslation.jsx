import React from "react";
import { Translation } from "react-i18next";

export default function CustomTranslation({ text }) {
  return <Translation>{(t, { i18n }) => <p>{t(text)}</p>}</Translation>;
}
