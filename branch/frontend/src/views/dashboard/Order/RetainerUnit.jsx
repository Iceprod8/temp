// This is a duplicate of the "retainerUnit"
// It wasn't done cleanly because of time constraint
// To be remade, both aligners and retainers

import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import styles, { textFieldSx, mainColor } from "@inplan/common/Form/styles";
import { NumericFormat } from "react-number-format";
import { useTranslation } from "react-i18next";

// Validation Order Aligner

const localStyles = {
  label: {
    marginRight: 8,
    whiteSpace: "nowrap",
    width: 100,
    textAlign: "end",
    color: mainColor,
  },
};

export default function RetainerUnit({
  control,
  top,
  dual,
  getValues,
  maxAndminAligners,
}) {
  const { t: translation } = useTranslation();
  const withValueLimit = (value, isStart) => {
    // FIXME: the on-the-fly validation for number is not suitable
    // The validation is trigger at each keyboard input
    // and block multi digit number
    // prefer form validation at input focusout for example
    if (value === undefined) return true;
    /*
    const startmin = getValues(
      top ? "start_aligner_top" : "start_aligner_bottom"
    );
    if (!isStart && startmin === undefined) return false;
    */
    const startmin = 0;

    // Only integers
    if (value !== Math.floor(value)) return false;
    const min = Math.max(
      isStart ? 0 : startmin,
      maxAndminAligners[top ? "topMin" : "botMin"],
    );
    const max = maxAndminAligners[top ? "topMax" : "botMax"];

    if (undefined in [min, max]) return true;

    console.debug(value, maxAndminAligners, getValues, isStart);
    return value >= min && value <= max;
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={localStyles.label}>
        {translation(
          "dashboard.orders.form.fields.retainers_detail.rank_in_setup",
        )}
      </div>
      <div>
        <Controller
          name={top ? "start_aligner_top" : "start_aligner_bottom"}
          control={control}
          render={({ field }) => (
            <div style={styles.fieldSmall}>
              <NumericFormat
                customInput={TextField}
                {...field}
                isAllowed={(e) => withValueLimit(e.floatValue, true)}
                autoComplete="off"
                inputProps={{
                  type: "numeric",
                  sx: {
                    ...styles.fontSettings,
                    cursor: "pointer",
                  },
                  "data-test": top
                    ? "start_aligner_top"
                    : "start_aligner_bottom",
                  autoComplete: "off",
                  inputMode: "number",
                }}
                autoFocus
                label={
                  dual && top
                    ? `${translation(
                        "dashboard.orders.form.fields.retainers_detail.upper_rank",
                      )}`
                    : dual
                      ? `${translation(
                          "dashboard.orders.form.fields.retainers_detail.lower_rank",
                        )}`
                      : "Rank"
                }
                variant="outlined"
                sx={textFieldSx}
                onChange={field.onChange}
                value={field.value}
                name={field.name}
              />
            </div>
          )}
        />
      </div>
      <div style={localStyles.label}>
        {translation("dashboard.orders.form.fields.retainers_detail.quantity")}
      </div>
      <div>
        <Controller
          name={top ? "multiplicity_top" : "multiplicity_bottom"}
          control={control}
          render={({ field }) => (
            <div style={styles.fieldSmall}>
              <NumericFormat
                customInput={TextField}
                {...field}
                isAllowed={(e) => withValueLimit(e.floatValue, false)}
                autoComplete="off"
                inputProps={{
                  sx: {
                    ...styles.fontSettings,
                    cursor: "pointer",
                  },
                  autoComplete: "off",
                  inputMode: "number",
                }}
                autoFocus
                label={
                  dual && top
                    ? `${translation(
                        "dashboard.orders.form.fields.retainers_detail.quantity_upper",
                      )}`
                    : dual
                      ? `${translation(
                          "dashboard.orders.form.fields.retainers_detail.quantity_lower",
                        )}`
                      : "Quantity"
                }
                variant="outlined"
                sx={textFieldSx}
                onChange={field.onChange}
                value={field.value}
                name={field.name}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}
