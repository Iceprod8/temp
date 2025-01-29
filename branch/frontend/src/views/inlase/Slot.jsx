import React from "react";
import { useBatchContext } from "@inplan/common/Batch/BatchContext";
import { useTranslation } from "react-i18next";

export default function Slotranslation({ index, aligners }) {
  const { t: translation } = useTranslation();
  const { sheetDict } = useBatchContext();

  let sheetId = "0";
  if (aligners[index]) {
    if (aligners[index].short_code !== "empty") {
      if (aligners[index].sheet_id) {
        if (aligners[index].sheet_id !== "None")
          sheetId = aligners[index].sheet_id;
      }
    }
  }

  const sheetDetails = sheetDict[sheetId];

  return (
    <td className="text-center">
      {aligners[index] && aligners[index].short_code !== "empty" ? (
        <>
          <p>{aligners[index].short_code}</p>
          {sheetId !== "0" ? (
            <p className="text-small text-muted">
              {sheetDetails.provider}
              {" - "}
              {sheetDetails.thickness}mm
            </p>
          ) : (
            <p className="text-small text-muted">
              {translation("inlase.undefined_sheet").toUpperCase()}
            </p>
          )}
        </>
      ) : (
        <div>
          <p className="text-secondary">
            {translation("inlase.slots_available", { nbr: index + 1 })}
          </p>
          <p className="text-small text-muted">-</p>
        </div>
      )}
    </td>
  );
}
