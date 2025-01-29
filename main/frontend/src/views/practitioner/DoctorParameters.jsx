import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import BasicSelect from "@inplan/common/BasicSelect";
import { useAppContext } from "@inplan/AppContext";

const DoctorParameters = () => {
  const { t: translation } = useTranslation();
  const [doctorList, setDoctorList] = useState([]);
  const [isCreatingDoctor, setIsCreatingDoctor] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState("");
  const { defaultDoctor, setDefaultDoctor } = useAppContext();

  // Fetch the list of available doctors
  const getDoctorList = async () => {
    const { data } = await backend.get("doctors/available");
    setDoctorList(data);
  };

  // Create a new doctor
  const createDoctor = async () => {
    if (!newDoctorName.trim()) return;

    try {
      const { data } = await backend.post(`users/create_doctor`, {
        appellation: newDoctorName,
      });
      await getDoctorList();
      setDefaultDoctor(data.id);
      setNewDoctorName("");
      setIsCreatingDoctor(false);
    } catch (error) {
      console.error("Failed to create doctor:", error);
    }
  };

  useEffect(() => {
    getDoctorList();
  }, []);

  return (
    <div>
      <div className="page-head__title">
        <h2 className="h2">
          {translation(
            "navbar.profile.parameters.order_template.settings.doctors.default_doctor"
          )}
        </h2>
      </div>
      <div
        style={{
          flex: 1,
          marginTop: 10,
          marginBottom: 20,
        }}
        className="flex alignItems-center"
      >
        <BasicSelect
          value={defaultDoctor}
          setValue={setDefaultDoctor}
          data-test="selectSetup"
          data={{
            name: "doctors",
            label: "doctors",
            choices: doctorList,
          }}
          styles={{
            classes: "btn-tertiary",
            boxStyle: { height: "35px", width: "220px" },
            fontSettings: { fontSize: "15px" },
            selectLabel: { color: "var(--color-primary)" },
          }}
        />
        {/* Button to toggle doctor creation */}
        <button
          type="button"
          style={{ marginLeft: 10 }}
          className="btn btn-primary"
          onClick={() => setIsCreatingDoctor(!isCreatingDoctor)}
        >
          {translation(
            isCreatingDoctor
              ? "navbar.profile.parameters.order_template.settings.doctors.cancel"
              : "navbar.profile.parameters.order_template.settings.doctors.add_doctor"
          )}
        </button>
      </div>

      {/* Form to create a new doctor */}
      {isCreatingDoctor && (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder={translation(
              "navbar.profile.parameters.order_template.settings.doctors.doctor_name"
            )}
            value={newDoctorName}
            onChange={(e) => setNewDoctorName(e.target.value)}
            style={{
              height: "35px",
              width: "220px",
              fontSize: "15px",
              padding: "5px",
              border: "1px solid var(--color-primary)",
              borderRadius: "4px",
            }}
          />
          <button
            type="button"
            className="btn btn-success"
            onClick={createDoctor}
            disabled={newDoctorName.trim() === ""}
          >
            {translation(
              "navbar.profile.parameters.order_template.settings.doctors.save_doctor"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorParameters;
