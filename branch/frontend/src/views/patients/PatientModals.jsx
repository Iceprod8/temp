import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@inplan/common/Modal";
import { TextField, Box, Button } from "@mui/material";

export default function PatientModal({
  open,
  onClose,
  onValidation,
  setRefresh,
}) {
  const [firstName, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    Object.assign(data, { gender: 0 });
    if (data.birth_date === "") {
      Object.assign(data, { birth_date: null });
    }
    try {
      await onValidation(data);
      setRefresh(true);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const { t: translation } = useTranslation();
  const fullName = `${translation("patients.new_patient_form.title")}`;

  return (
    <Modal title={fullName} onClose={onClose} open={open}>
      <form onSubmit={handleSubmit}>
        <Box
          className="modal-content__patient"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: 2,
          }}
        >
          {/* Last Name Field */}
          <TextField
            label={translation("patients.new_patient_form.fields.last_name")}
            variant="outlined"
            name="last_name"
            id="last_name"
            data-test="last_name"
            onChange={(e) => setLastname(e.target.value)}
            value={lastname}
            fullWidth
          />

          {/* First Name Field */}
          <TextField
            label={translation("patients.new_patient_form.fields.first_name")}
            variant="outlined"
            name="first_name"
            id="first_name"
            data-test="first_name"
            onChange={(e) => setFirstname(e.target.value)}
            value={firstName}
            fullWidth
          />

          {/* Identifier Field */}
          <TextField
            label={translation("patients.new_patient_form.fields.identifier")}
            variant="outlined"
            name="identifier"
            id="identifier"
            data-test="identifier"
            onChange={(e) => setIdentifier(e.target.value)}
            value={identifier}
            fullWidth
          />

          {/* Birth Date Field */}
          <TextField
            label={translation("patients.new_patient_form.fields.birth_date")}
            variant="outlined"
            name="birth_date"
            id="birth_date"
            data-test="birth_date"
            type="date"
            onChange={(e) => setBirthDate(e.target.value)}
            value={birthDate}
            InputLabelProps={{
              shrink: true, // Keeps the label visible when a date is selected
            }}
            fullWidth
          />

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button variant="outlined" color="secondary" onClick={onClose}>
              {translation("patients.new_patient_form.buttons.cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              data-test="new_patient_submit"
            >
              {translation("patients.new_patient_form.buttons.confirm")}
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  );
}
