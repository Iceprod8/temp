import React from "react";
import clsx from "clsx";
import { CgTrash } from "react-icons/cg";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@inplan/AppContext";
import { weekDiff } from "@inplan/adapters/functions";

import { useDashboardContext } from "./Context";

function sumDiff(lists) {
  /* To check if aligners rank are consecutive */
  const value = lists.reduce(
    (acc, m) => {
      const [cumul, prev] = acc;
      return [cumul + (prev ? m.rank - prev : 0), m.rank];
    },
    [0, null]
  );

  return value - lists.length;
}

function summarizeRange(models) {
  /*
     Transform list of models into a more concise string
     if the ranks are consecutive, use a range, if not, enumerate
     the ranks with a coma
   */
  return models.length > 0
    ? sumDiff(models) > 0
      ? models.map((x) => x.rank).join(", ")
      : `${models[0].rank}-${models[models.length - 1].rank}`
    : "-";
}

export default function CardPeriod({ period, onDelete, onClick }) {
  const { periods, currentPeriod, setCurrentPeriod, setups, models } =
    useDashboardContext();
  const { language } = useAppContext();
  const { t: translation } = useTranslation();
  const weeks = weekDiff(periods[0].start_date, period.start_date);

  const setup = setups?.find((s) => s.id === period.setup);

  const handleDelete = () => {
    setCurrentPeriod(period);
    onDelete("modal-deletePeriod");
  };

  const smodels = period.models
    .map((m) => models?.find((x) => x.id === m))
    .filter((x) => x);
  smodels.sort((a, b) => a.setup_rank - b.setup_rank);

  const uRange = summarizeRange(smodels.filter((m) => m.type === 0));
  const lRange = summarizeRange(smodels.filter((m) => m.type === 1));

  const mrange =
    uRange === lRange
      ? `aligners ${uRange}`
      : `uppers ${uRange} lowers ${lRange}`;

  let rankText = "";
  if (period.min_rank !== undefined && period.max_rank !== undefined) {
    // rankText = `Ranks ${period.min_rank} to ${period.max_rank}`;
    rankText = translation("dashboard.period_information.card.rank_text", {
      min_rank: period.min_rank,
      max_rank: period.max_rank,
    });
  }

  let period_start_date = "";
  let period_end_date = "";
  if (language === "en") {
    period_start_date = period.start_date;
    period_end_date = period.end_date;
  } else {
    period_start_date = new Date(period.start_date)
      .toLocaleDateString("fr-FR")
      .replace(/\//g, "-");
    period_end_date = new Date(period.end_date)
      .toLocaleDateString("fr-FR")
      .replace(/\//g, "-");
  }
  return (
    <>
      <div
        data-test="step_card"
        className={clsx("cardPeriod")}
        style={{ margin: 5 }}
      >
        <div
          className={clsx(
            "cardPeriod__head",
            currentPeriod?.id === period.id ? "is-selected" : null
          )}
        >
          <div className="cardPeriod-head">
            <div className="cardPeriod-head__info">
              + {weeks} {translation("dashboard.period_information.card.weeks")}
            </div>
            {period.name}
            <div className="cardPeriod-head__actions">
              <CgTrash
                name="delete"
                className="icon icon-delete"
                size={14}
                style={{
                  fill: "currentColor",
                }}
                data-test="delete-step"
                onClick={handleDelete}
              />
            </div>
          </div>
        </div>
        <div className="cardPeriod__body" onClick={() => onClick(period)}>
          <div className="cardPeriod-main">
            <p>
              <span>
                {translation("dashboard.period_information.card.from")}
              </span>
              {period_start_date}
              <span>{translation("dashboard.period_information.card.to")}</span>
              {period_end_date}
            </p>
            <p>{rankText}</p>
          </div>
        </div>
      </div>
    </>
  );
}
