import React, { useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({
  value,
  setValue,
  data,
  styles,
  multiple,
  "data-test": dataTest,
}) {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState(undefined);

  const handleChange = (event) => {
    if (multiple) {
      let {
        target: { value: values },
      } = event;

      /* TODO: could be improve */
      const prev = value.map((x) => x.id);
      const selected = values.filter((x) => !prev.includes(x))[0];
      if (event.shiftKey && last) {
        const s = data.choices.findIndex((x) => x.id === last);
        const e = data.choices.findIndex((x) => x.id === selected);
        values = [
          ...values,
          ...data.choices.filter((_, i) => i > s && i < e).map((x) => x.id),
        ];
      } else {
        setLast(selected);
      }
      setValue(data.choices.filter((x) => values.includes(x?.id)));
    } else {
      setValue(data.choices.filter((x) => x?.id === event.target.value)[0]);
    }
  };

  const getItemLabel = (item) => {
    // If `name` exists, return it.
    if (item?.name) return item?.name;

    // If `appellation` exists, return it.
    if (item?.appellation) return item?.appellation;

    // Otherwise, return `username`.
    return item?.username;
  };

  return (
    <Box>
      <FormControl fullWidth>
        <Select
          data-test={dataTest}
          className={styles?.classes}
          displayEmpty={!data?.choices}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={multiple ? value?.map((v) => v.id) || [] : value?.id || ""}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onChange={handleChange}
          multiple={multiple || false}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: open ? styles?.borderOpened : styles?.borderClosed,
            },
            ...styles?.fontSettings,
            ...styles?.boxStyle,
          }}
        >
          {data?.choices?.map((item) => (
            <MenuItem key={item?.id} value={item?.id}>
              {getItemLabel(item)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
