import React from "react";
import TextField from "@mui/material/TextField";
import styles, { textFieldSx } from "@inplan/common/Form/styles";
import { Controller } from "react-hook-form";

export default function TextFieldBasic({ data, control }) {
  return (
    <div
      style={{
        ...styles.fieldContainer,
      }}
    >
      <Controller
        name={data.name}
        control={control}
        render={({ field }) => (
          <div style={styles.field}>
            <TextField
              inputProps={{
                sx: {
                  ...styles.fontSettings,
                  cursor: "pointer",
                },
                autoComplete: "off",
              }}
              autoFocus
              label={data.label}
              variant="outlined"
              sx={textFieldSx}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              value={field.value}
              name={field.name}
            />
          </div>
        )}
      />
    </div>
  );
}
