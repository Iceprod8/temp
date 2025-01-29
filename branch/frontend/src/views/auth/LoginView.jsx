import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { BsFillPersonFill } from "react-icons/bs";
import { BiKey } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const styles = {
  img: { marginRight: 6 },
  icon: {
    padding: "9px 0px",
    fontSize: 20,
  },
  emptyDiv: { width: 6 },
  emphasizedHelpText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
  },
  form: { display: "flex", flexDirection: "column" },
  label: { fontSize: 20 },
  textField: { width: "100%" },
  submitContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  submitButton: { width: 95, heigth: 30 },
  helpText: {
    color: "black",
    fontSize: 14,
    fontStyle: "italic",
    "&:hover": { color: "#2061d1" },
  },
};

export default function LoginView({ handleLogin }) {
  const { t: translation } = useTranslation();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <form style={styles.form} onSubmit={handleSubmit(handleLogin)}>
      <div>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              autoComplete="off"
              autoFocus
              label={translation("login.form.fields.username")}
              InputProps={{
                autoComplete: "off",
                startAdornment: (
                  <BsFillPersonFill fontSize={22} style={styles.img} />
                ),
                sx: styles.icon,
                "data-name": "email",
              }}
              variant="standard"
              sx={styles.textField}
              InputLabelProps={{ sx: styles.label }}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              value={field.value}
              name={field.name}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              autoComplete="off"
              label={translation("login.form.fields.password")}
              InputProps={{
                autoComplete: "off",
                startAdornment: <BiKey fontSize={22} style={styles.img} />,
                sx: styles.icon,
                type: "password",
                "data-name": "password",
              }}
              variant="standard"
              sx={{ ...styles.textField, margin: "20px 0px" }}
              InputLabelProps={{ sx: styles.label }}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              value={field.value}
              name={field.name}
            />
          )}
        />
      </div>
      <div style={styles.submitContainer}>
        <Button
          type="submit"
          variant="contained"
          sx={styles.submitButton}
          data-wait="Please wait..."
          name="submit"
          data-name="submit"
        >
          {translation("login.form.button")}
        </Button>
      </div>
      <Link to="/forgot-password">
        <Typography sx={styles.helpText}>
          {translation("login.forgot_password")}
        </Typography>
      </Link>
      <Link to="/register">
        <div style={{ ...styles.helpText, display: "flex" }}>
          {translation("login.not_account_yet")}
          <div style={styles.emptyDiv} />
          <Typography sx={styles.emphasizedHelpText}>
            {translation("login.register")}
          </Typography>
        </div>
      </Link>
    </form>
  );
}
