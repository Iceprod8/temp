export const mainColor = "#282C33";
export const backgroundEdit = "#a2afbe79";

const styles = {
  flexFullCentered: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  fontSettings: {
    // color: "#F6F6F6",
    color: `${mainColor}`,
    fontFamily: "Source Sans Pro !important",
    fontWeight: 700,
  },
  field: { width: 140 },
  fieldSmall: { width: 70 },
  fieldContainer: {
    minWidth: 140,
  },
  textFieldLabel: {
    // color: "#F6F6F6 !important",
    color: `${mainColor} !important`,
    fontFamily: "Source Sans Pro",
  },
  textFieldInput: { border: `1px solid ${mainColor} !important` },
  // textFieldInput: { border: "1px solid #F6F6F6 !important" },
  textFieldFocused: {
    color: `${mainColor} !important`,
    // color: "#F6F6F6 !important",
    border: `3px solid ${mainColor} !important`,
    // border: "3px solid #F6F6F6 !important",
  },
  selectLabel: {
    color: `${mainColor} !important`,
    // color: "#F6F6F6 !important",
    fontFamily: "Source Sans Pro",
  },
  // selectOpened: { border: "3px solid #F6F6F6 !important" },
  selectOpened: { border: `3px solid ${mainColor} !important` },
  selectClosed: { border: `1px solid ${mainColor} !important` },
  // selectClosed: { border: "1px solid #F6F6F6 !important" },
  containerStyle: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(5, 1fr)",
    padding: "20px",
  },
  patientContainerStyle: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(4, 1fr)",
    padding: "20px",
  },
  infoCellStyle: {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "left",
  },
  titleCellStyle: {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "left",
    fontWeight: "bold",
  },
  onTopStyle: {
    padding: "7px",
    fontSize: "125%",
  },
  alignerChartStyle: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "repeat(1, 1fr)",
  },
};

export const textFieldSx = {
  caretColor: "black",
  "& .Mui-focused": {
    "& > fieldset": styles.textFieldFocused,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: styles.textFieldInput,
    color: `${mainColor} !important`,
  },
  "& label": {
    color: styles.textFieldLabel,
  },
};

export const defaultSettingsSx = {
  ...styles.fontSettings,
  height: 36,
  width: 142,
  marginRight: "8px",

  // "&:hover": {
  //   color: "black",
  //   backgroundColor: "white",
  // },
  "&:hover": {
    backgroundColor: "black",
    color: "#f6f6F6",
    border: "#f6f6f6",
  },
};

export const submitFormSx = {
  ...styles.fontSettings,
  height: 36,
  border: "none !important",
  marginRight: "8px",

  "&:hover": {
    backgroundColor: "black",
    color: "#f6f6F6",
    border: "#f6f6f6",
  },
};

export default styles;
