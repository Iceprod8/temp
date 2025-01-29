import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import en from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";
import { TbPrinter } from "react-icons/tb";
import { backend } from "@inplan/adapters/apiCalls";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import getCurrentLanguage from "@inplan/common/translation/CurrentLanguage";
import "@inplan/assets/scss/pages/dashboard_patient.scss";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

// Used in DataPicker component
registerLocale("fr", fr);
registerLocale("en", en);

//  TODO: Improve by removing all duplicated patient fetching logic compared to patient Editor

export default function PatientEditor({ patientId, refreshPage }) {
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const [formData, setFormData] = useState(null);
  const [formDataAddress, setFormDataAddress] = useState(null);
  const [patient, setPatient] = useState(null);

  const fetchPatient = async (patientIdIn) => {
    const { data } = await backend.get(`patients/${patientIdIn}`);
    // setPatient(data);
    return data;
  };

  // Function updating all order fields from backend
  const refreshEditor = async () => {
    await refreshPage();

    if (!patientId) return;

    const fetchedpatient = await fetchPatient(patientId);
    if (!fetchedpatient) return;

    setPatient(fetchedpatient);

    // should be filled with undefined if null
    // Only editable data
    setFormData({
      last_name: fetchedpatient.last_name,
      first_name: fetchedpatient.first_name,
      identifier: fetchedpatient.identifier,
      birth_date: fetchedpatient.birth_date,
      email: fetchedpatient.email,
    });
    setFormDataAddress({
      address_line1: fetchedpatient.postal_address?.address_line1
        ? fetchedpatient.postal_address?.address_line1
        : "",
      address_line2: fetchedpatient.postal_address?.address_line2
        ? fetchedpatient.postal_address?.address_line2
        : "",
      zip: fetchedpatient.postal_address?.zip
        ? fetchedpatient.postal_address?.zip
        : "",
      city: fetchedpatient.postal_address?.city
        ? fetchedpatient.postal_address?.city
        : "",
      state: fetchedpatient.postal_address?.state
        ? fetchedpatient.postal_address?.state
        : "",
      country: fetchedpatient.postal_address?.country
        ? fetchedpatient.postal_address?.country
        : "",
    });
  };

  // Initialize
  useEffect(() => {
    if (!patientId) return;
    refreshEditor();
  }, [patientId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeAddress = (e) => {
    setFormDataAddress({
      ...formDataAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleDatePick = (inputDate) => {
    if (inputDate) {
      const formatedDate = inputDate.toISOString().slice(0, 10);
      setFormData({
        ...formData,
        birth_date: formatedDate,
      });
    }
  };

  const validateEmail = (value) => {
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email_pattern.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check the email field
      if (
        formData.email !== "" &&
        formData.email !== null &&
        validateEmail(formData.email) === false
      ) {
        showSnackbar(
          translation("messages.patients.email_is_not_valid"),
          "error",
        );
        return;
      }
      // Check if an address field has been changed
      let address_has_been_modified = 0;
      Object.entries(formDataAddress).forEach(([key, value]) => {
        if (
          patient?.postal_address &&
          formDataAddress[key] !== patient?.postal_address[key]
        ) {
          address_has_been_modified += 1;
        } else if (!patient?.postal_address && formDataAddress[key] !== "") {
          address_has_been_modified += 1;
        }
      });

      // Used in case some transformation are needed - like date formatting
      const postProcessData = { ...formData };

      // if an address field has changed, add new information to the JSON to be sent
      if (address_has_been_modified > 0) {
        postProcessData.postal_address = { ...formDataAddress };
      }

      const jsonData = JSON.stringify(postProcessData);
      await backend.patch(`patients/${patientId}`, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      refreshEditor();
      showSnackbar(translation("messages.patients.patient_updated"), "success");
    } catch (error) {
      showSnackbar(
        translation("messages.patients.error_updating_patient"),
        "error",
      );
      console.error("Error updating patient:", error);
    }
  };

  const ln = getCurrentLanguage();

  return (
    <div className="patient-editor">
      <h1 className="patient-editor__header">
        <CustomTranslation text="patient_profile.table.name" />
      </h1>

      {patient && formData && (
        <form className="patient-editor__form" onSubmit={handleSubmit}>
          <div className="patient-editor__form-row">
            <label>
              <CustomTranslation text="patient_profile.table.columns.element.identifier" />
            </label>
            <div className="value">{patient.identifier}</div>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
            />
          </div>
          <div className="patient-editor__form-row">
            <label>
              <CustomTranslation text="patient_profile.table.columns.element.last_name" />
            </label>
            <div className="value">{patient.last_name}</div>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="patient-editor__form-row">
            <label>
              <CustomTranslation text="patient_profile.table.columns.element.first_name" />
            </label>
            <div className="value">{patient.first_name}</div>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="patient-editor__form-row">
            <label>
              <CustomTranslation text="patient_profile.table.columns.element.birth_date" />
            </label>
            <div className="value">{patient.birth_date}</div>
            <DatePicker
              selected={new Date(formData.birth_date)}
              onChange={handleDatePick}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="patient-editor__form-row">
            <label>
              <CustomTranslation text="patient_profile.table.columns.element.email" />
            </label>
            <div className="value">{patient.email ? patient.email : "-"}</div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <h2 className="patient-editor__address-title">
            <CustomTranslation text="patient_profile.table.columns.element.address.title" />
          </h2>
          <div className="patient-editor__address-row">
            <input
              type="text"
              placeholder={translation(
                "patient_profile.table.columns.element.address.address-line1",
              )}
              value={formDataAddress?.address_line1 || ""}
              onChange={handleChangeAddress}
              name="address_line1"
            />
            <input
              type="text"
              placeholder={translation(
                "patient_profile.table.columns.element.address.address-line2",
              )}
              value={formDataAddress?.address_line2 || ""}
              onChange={handleChangeAddress}
              name="address_line2"
            />
          </div>
          <div className="patient-editor__address-row">
            <input
              type="text"
              placeholder={translation(
                "patient_profile.table.columns.element.address.zip",
              )}
              value={formDataAddress?.zip || ""}
              onChange={handleChangeAddress}
              name="zip"
            />
            <input
              type="text"
              placeholder={translation(
                "patient_profile.table.columns.element.address.city",
              )}
              value={formDataAddress?.city || ""}
              onChange={handleChangeAddress}
              name="city"
            />
          </div>
          <div className="patient-editor__address-row">
            <input
              type="text"
              placeholder={translation(
                "patient_profile.table.columns.element.address.state",
              )}
              value={formDataAddress?.state || ""}
              onChange={handleChangeAddress}
              name="state"
            />
            <input
              type="text"
              placeholder={translation(
                "patient_profile.table.columns.element.address.country",
              )}
              value={formDataAddress?.country || ""}
              onChange={handleChangeAddress}
              name="country"
            />
          </div>
          <div className="patient-editor__buttons">
            <button type="submit" className="btn btn-primary">
              <CustomTranslation text="patient_profile.buttons.save" />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                window.open(`/addresslabel/${patientId}`, "_blank")
              }
            >
              <TbPrinter style={{ marginRight: 5 }} />
              <CustomTranslation text="patient_profile.buttons.print_address" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
