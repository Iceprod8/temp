import React from "react";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const Field = ({ disabled, data, styles, rootStyles, control }) => (
  <div style={rootStyles}>
    <Controller
      control={control}
      name={data.name}
      render={({ field }) => (
        <TextField
          disabled={disabled}
          label={data.label}
          onChange={(e) => {
            field.onChange(e.target.value);
          }}
          inputProps={{
            sx: {
              ...styles.input,
              cursor: disabled ? "not-allowed" : "pointer",
            },
          }}
          sx={styles.root}
          value={field.value}
          name={field.name}
          variant="outlined"
        />
      )}
    />
  </div>
);

export default Field;
