import React from "react";
import { MenuItem, Select } from "@mui/material";

const SimpleSelect = ({ defaultValue, setDefaultValue, choices }) => {
  return (
    <div style={{ marginBottom: "0px", marginTop: "10px" }}>
      <Select
        value={defaultValue}
        onChange={(e) => {
          setDefaultValue(e.target.value);
        }}
        sx={{
          height: "35px",
          width: "220px",
          fontSize: "15px",
          "&.MuiSelect-select": {
            classes: "btn-tertiary",
          },
          background: "var(--color-tertiary)",
          border: "1px solid var(--color-primary)",
        }}
      >
        {choices?.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.display_name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default SimpleSelect;
