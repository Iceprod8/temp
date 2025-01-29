import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import styles, { textFieldSx } from "@inplan/common/Form/styles";

export default function NotesField({ data, control }) {
  return (
    <Controller
      name={data.name}
      control={control}
      render={({ field }) => (
        <div>
          <TextField
            inputProps={{
              sx: {
                ...styles.fontSettings,
                cursor: "pointer",
              },
            }}
            autoFocus
            label={data.label}
            variant="outlined"
            sx={textFieldSx}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            multiline
            rows={3}
            value={field.value}
            name={field.name}
          />
        </div>
      )}
    />
  );
}
