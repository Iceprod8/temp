import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import en from "date-fns/locale/en-GB";

import { Controller } from "react-hook-form";

import { toReadableDateString } from "@inplan/adapters/functions";

import styles, { textFieldSx, mainColor } from "@inplan/common/Form/styles";
import getCurrentLanguage from "./translation/CurrentLanguage";

registerLocale("fr", fr);
registerLocale("en", en);

export default function DateField({ data, control }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const ln = getCurrentLanguage();
  const { t: translation } = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        // width: "100%",
      }}
    >
      <div>
        <div style={styles.fieldContainer}>
          <Controller
            name={data.name}
            control={control}
            render={({ field }) => (
              <div
                style={{
                  ...styles.field,
                  display: "flex",
                  justifyContent: "end",
                  width: "100%",
                }}
              >
                <ReactDatePicker
                  locale={ln}
                  dateFormat={translation(
                    "utilities.ReactDatePicker.dateFormat"
                  )}
                  showTimeSelect
                  timeCaption={translation(
                    "utilities.ReactDatePicker.timeCaption"
                  )}
                  timeFormat={translation(
                    "utilities.ReactDatePicker.timeFormat"
                  )}
                  timeIntervals={15}
                  selected={field.value ? new Date(field.value) : new Date()}
                  onChange={(date) => {
                    setSelectedDate(date);
                    const isoDate = date?.toISOString();
                    field.onChange(isoDate);
                  }}
                  customInput={
                    <TextField
                      inputProps={{
                        type: "text",
                        placeholder: translation(
                          "utilities.ReactDatePicker.placeholder"
                        ),
                        sx: {
                          ...styles.fontSettings,
                          cursor: "pointer",
                        },
                      }}
                      label={data.label}
                      sx={{
                        ...textFieldSx,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: !selectedDate
                            ? "red !important"
                            : "#F6F6F6 !important",
                        },
                      }}
                    />
                  }
                />
              </div>
            )}
          />
        </div>
      </div>
      <div style={{ color: mainColor }}>
        {!selectedDate && translation("messages.common.choose_a_date")}
        {/* {selectedDate
          ? toReadableDateString(selectedDate)
          : translation("messages.common.choose_a_date")} */}
      </div>
    </div>
  );
}
