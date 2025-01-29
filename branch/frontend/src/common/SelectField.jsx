import React from "react";
import { Controller } from "react-hook-form";
import { Select, MenuItem, InputLabel, Box, FormControl } from "@mui/material";
import styles from "@inplan/common/Form/styles";

export default function SelectField({ data, control, open, setOpen }) {
  return (
    <div style={{ ...styles.fieldContainer, marginRight: 20 }}>
      <Controller
        name={data.name}
        control={control}
        render={({ field }) => (
          <div style={styles.field} key={field.id}>
            <Box>
              <FormControl fullWidth>
                {data.choices && (
                  <InputLabel sx={styles.selectLabel}>{data.label}</InputLabel>
                )}
                <Select
                  displayEmpty={!data.choices}
                  open={open?.field === field.name}
                  value={field.value}
                  inputProps={{ value: field.value }}
                  name={field.name}
                  label={data.label}
                  onOpen={() => setOpen({ field: field.name })}
                  onClose={() => setOpen(false)}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border:
                        open?.field === field.name
                          ? styles.selectOpened.border
                          : styles.selectClosed.border,
                    },
                    ...styles.fontSettings,
                  }}
                  data-test={field.name}
                >
                  {data.choices?.map((orderOpt) => (
                    <MenuItem
                      key={orderOpt.value}
                      value={orderOpt.value}
                      data-test="selectfield-item"
                      sx={{
                        fontFamily: "Source Sans Pro",
                        textAlign: "justify",
                      }}
                    >
                      {orderOpt.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        )}
      />
    </div>
  );
}
