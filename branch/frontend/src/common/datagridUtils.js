import {
  toReadableDateString,
  toReadableDatetimeString,
} from "@inplan/adapters/functions";

function firstUpper(stg) {
  if (!stg) return "";
  return stg.charAt(0).toUpperCase() + stg.slice(1).replace("_", " ");
}

export function singleSelectColumn(field, choices, options) {
  return {
    ...options,
    field,
    headerName: options?.headerName || firstUpper(field),
    type: "singleSelect",
    valueOptions: choices.map((c, i) => ({
      label: c,
      value: i,
    })),
    flex: 1,
    valueFormatter: ({ value }) => firstUpper(choices[value]),
    valueSetter: ({ value, row }) => ({ ...row, [field]: value }),
  };
}

export function dateColumn(field, options) {
  return {
    field,
    headerName: options?.headerName || firstUpper(field),
    flex: 1,
    type: "date",
    valueFormatter: ({ value }) =>
      (value && toReadableDateString(new Date(value))) || "",
    ...options,
  };
}

export function dateTimeColumn(field, options) {
  return {
    field,
    headerName: options?.headerName || firstUpper(field),
    flex: 1,
    type: "dateTime",
    valueFormatter: ({ value }) =>
      (value && toReadableDatetimeString(new Date(value))) || "",
    ...options,
  };
}
