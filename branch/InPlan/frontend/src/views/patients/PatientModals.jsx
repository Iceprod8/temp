import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import Modal from "@inplan/common/Modal";

export default function PatientModal({
  onValidation,
  setRefresh,
  patient,
  setModal,
  fetchPatient,
}) {
  const [firstName, setFirstname] = useState(patient ? patient.first_name : "");
  const [lastname, setLastname] = useState(patient ? patient.last_name : "");
  const [birthDate, setBirthDate] = useState(
    patient && patient.birth_date !== null ? patient.birth_date : ""
  );
  const [identifier, setIdentifier] = useState(
    patient && patient.identifier && patient.identifier !== null
      ? patient.identifier
      : ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    Object.assign(data, { gender: 0 });
    if (data.birth_date === "") {
      Object.assign(data, { birth_date: null });
    }
    try {
      // create patient
      if (!patient) {
        await onValidation(data);
        // patch patient
      } else {
        await backend.patch(`patients/${patient.id}`, data);
        if (fetchPatient) {
          await fetchPatient(patient.id);
        }
      }
      setRefresh(true);
      setModal("");
    } catch (err) {
      console.error(err);
    }
  };
  const { t: translation } = useTranslation();
  const fullName = patient
    ? patient.first_name.concat(" ", patient.last_name)
    : `${translation("patients.new_patient_form.title")}`;

  return (
    <Modal title={fullName} onClose={setModal}>
      <form className="form" onSubmit={handleSubmit}>
        <div className="modal-content__patient">
          <div className="grid">
            {/* <CgProfile
              name="pp"
              size={130}
              style={{
                color: "#DADDE2",
                borderRadius: "5em",
              }}
            /> */}
            {/* <HiCamera
              name="camera"
              className="icon icon-camera"
              size={32}
              style={{
                color: "white",
                backgroundColor: "#2061D1",
                padding: "3px",
                borderRadius: "5em",
                position: "absolute",
                left: "110px",
                top: "88px",
              }}
            /> */}
            <div className="form-group">
              <label htmlFor="last_name">
                {translation("patients.new_patient_form.fields.last_name")}
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                data-test="last_name"
                onChange={(e) => {
                  setLastname(e.target.value);
                }}
                value={lastname}
              />
            </div>
            <div className="form-group">
              <label htmlFor="first_name">
                {translation("patients.new_patient_form.fields.first_name")}
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                data-test="first_name"
                onChange={(e) => {
                  setFirstname(e.target.value);
                }}
                value={firstName}
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">
                {translation("patients.new_patient_form.fields.identifier")}
              </label>
              <input
                type="text"
                name="identifier"
                id="identifier"
                data-test="identifier"
                onChange={(e) => {
                  setIdentifier(e.target.value);
                }}
                value={identifier}
              />
            </div>

            <div className="form-group">
              <label htmlFor="birth_date">
                {translation("patients.new_patient_form.fields.birth_date")}
              </label>
              <input
                type="date"
                name="birth_date"
                id="birth_date"
                data-test="birth_date"
                onChange={(e) => {
                  setBirthDate(e.target.value);
                }}
                value={birthDate}
                placeholder="ex. YYYY-MM-DD"
              />
            </div>

            {/* <hr style={{ marginTop: "8px" }} />

            <div className="form-group">
              <label htmlFor="phone_number">Phone number</label>
              <input
                type="text"
                name="phone_number"
                id="phone_number"
                data-test="phone_number"
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
                value={phoneNumber}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                data-test="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div> */}
            <div className="grid2">
              <button
                className="btn-modal-muted"
                type="button"
                onClick={() => setModal("")}
              >
                {translation("patients.new_patient_form.buttons.cancel")}
              </button>
              {!patient ? (
                <button
                  className="btn-modal-secondary"
                  data-test="new_patient_submit"
                  type="submit"
                >
                  {translation("patients.new_patient_form.buttons.confirm")}
                </button>
              ) : (
                <button
                  className="btn-modal-secondary"
                  data-test="new_patient_submit"
                  type="submit"
                >
                  {translation("patients.new_patient_form.buttons.save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
