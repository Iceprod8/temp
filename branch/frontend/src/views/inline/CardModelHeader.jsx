import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Checkbox } from "@mui/material";
import { useInlineContext } from "./InlineContext";

export default function CardModelHeader({ model, modelType, children }) {
  const { t: translation } = useTranslation();
  const { currentModel, setCurrentModel, selected, setSelectedModel } =
    useInlineContext();

  const isSelected = selected[model.id] ? selected[model.id] : false;
  const setIsSelected = (value) => setSelectedModel(model, value);

  const handleChecked = () => {
    setIsSelected(!isSelected);
  };

  useEffect(
    () => () => {
      setIsSelected(undefined);
    },
    []
  );

  return (
    <div
      className={clsx(
        "card",
        currentModel?.id === model.id ? "is-selected" : undefined
      )}
    >
      <div className="card-head" data-test="card-head">
        <div className="card-head__status">
          <div className="badge-little-info">
            <Checkbox
              sx={{ paddingLeft: 0, color: "white" }}
              checked={isSelected}
              onChange={handleChecked}
            />
            {/* Rank: */}
            {translation("dashboard.cutlines.card_model.rank")}
            {"\u00A0:\u00A0"}
            {model.rank}
            {modelType}
          </div>
        </div>
        <div className="card-head__actions flex alignItems-center">
          {children}
        </div>
      </div>
      <div
        className="card-body"
        data-test="card-body"
        onClick={() => {
          setCurrentModel(model);
        }}
      >
        {model.filename}
      </div>
    </div>
  );
}
