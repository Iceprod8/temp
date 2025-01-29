import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { backend } from "@inplan/adapters/apiCalls";
import { useAppContext } from "@inplan/AppContext";
import i18n from "@inplan/i18n";

export default function LanguageParameters() {
  const { t: translation } = useTranslation();
  const { language: ln } = useAppContext();
  const [language, setLanguage] = useState(ln);

  const handleChangeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const updateLanguageValue = async () => {
    try {
      await backend.post(`users/update_language_settings`, {
        language,
      });
      i18n.changeLanguage(language);
    } catch (error) {
      console.error("Error updating backend language:", error);
    }
  };
  return (
    <div>
      <div className="page-head__title">
        <h1 className="h1">
          {translation("navbar.profile.parameters.language.title")}
        </h1>
      </div>
      <div>
        <label
          style={{
            width: "210px",
            display: "inline-block",
            marginBottom: "25px",
            marginTop: "25px",
          }}
          htmlFor="language"
        >
          {translation("navbar.profile.parameters.language.name")}:
        </label>
        <select
          value={language}
          name="language"
          id="language"
          onChange={(e) => handleChangeLanguage(e)}
        >
          <option value="en">
            {translation("navbar.profile.parameters.language.options.english")}
          </option>
          <option value="fr">
            {translation("navbar.profile.parameters.language.options.french")}
          </option>
        </select>
      </div>
      <button
        className="btn-table-primary text-center"
        type="button"
        onClick={() => updateLanguageValue()}
        style={{ marginTop: "10px" }}
      >
        {translation("navbar.profile.parameters.language.button")}
      </button>
    </div>
  );
}
