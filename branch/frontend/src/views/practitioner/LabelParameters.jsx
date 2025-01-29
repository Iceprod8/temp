import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
import clsx from "clsx";
import { backend } from "@inplan/adapters/apiCalls";

const LabelParameters = ({ bag_label, order_label }) => {
  const { t: translation } = useTranslation();
  const [values, setValues] = useState({});

  const keyNamesBag = [
    "last_name_position_bag",
    "first_name_position_bag",
    "patient_identifier_position_bag",
    "office_position_bag",
    "doctor_position_bag",
    "rank_position_bag",
    "upper_detail_position_bag",
    "lower_detail_position_bag",
    "sheet_position_bag",
    "deadline_position_bag",
    // "note_position_bag",
    "delivery_place_position_bag",
    "text_1_position_bag",
    "text_2_position_bag",
    "text_3_position_bag",
    "text_4_position_bag",
  ];

  const keyLabelsBag = [
    translation("navbar.profile.parameters.options.last_name"),
    translation("navbar.profile.parameters.options.first_name"),
    translation("navbar.profile.parameters.options.identifier"),
    translation("navbar.profile.parameters.options.office"),
    translation("navbar.profile.parameters.options.doctor"),
    translation("navbar.profile.parameters.options.rank"),
    translation("navbar.profile.parameters.options.upper_serie_detail"),
    translation("navbar.profile.parameters.options.lower_serie_detail"),
    translation("navbar.profile.parameters.options.sheet"),
    translation("navbar.profile.parameters.options.deadline"),
    // "note",
    translation("navbar.profile.parameters.options.delivery_place"),
    translation("navbar.profile.parameters.options.text_display", { nbr: 1 }),
    translation("navbar.profile.parameters.options.text_display", { nbr: 2 }),
    translation("navbar.profile.parameters.options.text_display", { nbr: 3 }),
    translation("navbar.profile.parameters.options.text_display", { nbr: 4 }),
  ];

  const keyNamesOrder = [
    "last_name_position_order",
    "first_name_position_order",
    "patient_identifier_position_order",
    "office_position_order",
    "doctor_position_order",
    "upper_detail_position_order",
    "lower_detail_position_order",
    "sheet_position_order",
    "deadline_position_order",
    // "note_position_order",
    "delivery_place_position_order",
    "text_1_position_order",
    "text_2_position_order",
    "text_3_position_order",
    "text_4_position_order",
  ];

  const keyLabelsOrder = [
    translation("navbar.profile.parameters.options.last_name"),
    translation("navbar.profile.parameters.options.first_name"),
    translation("navbar.profile.parameters.options.identifier"),
    translation("navbar.profile.parameters.options.office"),
    translation("navbar.profile.parameters.options.doctor"),
    translation("navbar.profile.parameters.options.upper_serie_detail"),
    translation("navbar.profile.parameters.options.lower_serie_detail"),
    translation("navbar.profile.parameters.options.sheet"),
    translation("navbar.profile.parameters.options.deadline"),
    // "note",
    translation("navbar.profile.parameters.options.delivery_place"),
    translation("navbar.profile.parameters.options.text_display", { nbr: 1 }),
    translation("navbar.profile.parameters.options.text_display", { nbr: 2 }),
    translation("navbar.profile.parameters.options.text_display", { nbr: 3 }),
    translation("navbar.profile.parameters.options.text_display", { nbr: 4 }),
  ];

  const keyNamesBagText = [
    "text_1_content_bag",
    "text_2_content_bag",
    "text_3_content_bag",
    "text_4_content_bag",
  ];

  const keyLabelsBagText = [
    translation("navbar.profile.parameters.options.upper_text_content", {
      nbr: 1,
    }),
    translation("navbar.profile.parameters.options.upper_text_content", {
      nbr: 2,
    }),
    translation("navbar.profile.parameters.options.lower_text_content", {
      nbr: 1,
    }),
    translation("navbar.profile.parameters.options.lower_text_content", {
      nbr: 2,
    }),
  ];
  const keyNamesOrderText = [
    "text_1_content_order",
    "text_2_content_order",
    "text_3_content_order",
    "text_4_content_order",
  ];

  const keyLabelsOrderText = [
    translation("navbar.profile.parameters.options.upper_text_content", {
      nbr: 1,
    }),
    translation("navbar.profile.parameters.options.upper_text_content", {
      nbr: 2,
    }),
    translation("navbar.profile.parameters.options.lower_text_content", {
      nbr: 1,
    }),
    translation("navbar.profile.parameters.options.lower_text_content", {
      nbr: 2,
    }),
  ];

  //   function OneZeroCheckBox({ value, setValue, onClick }) {
  //     return (
  //       <div className="form-switch" onClick={onClick}>
  //         <input
  //           type="checkbox"
  //           checked={!!checked}
  //           onChange={() => setChecked()}
  //         />
  //         <label onClick={() => setChecked()}>
  //           <span className={clsx("switch")} />
  //         </label>
  //       </div>
  //     );
  //   }

  const getBackendValues = async () => {
    const undefinedSetting = {
      id: "0",
    };
    const response = await backend.get(`offices/get_label_description`);
    if (response.status === 200) {
      return response.data;
    }
    console.error("Error fetching backend get");
    return { undefinedSetting };
  };

  // Fetch values from backend on component mount
  useEffect(() => {
    const fetchBackendValues = async () => {
      try {
        const backendValues = await getBackendValues();
        setValues(backendValues);
      } catch (error) {
        console.error("Error fetching backend values:", error);
      }
    };

    fetchBackendValues();
  }, []);

  const updateBackendValues = async () => {
    try {
      await backend.post(`offices/update_label_description`, values);
      NotificationManager.success(
        translation("messages.parameters.labels.success")
      );
    } catch (error) {
      NotificationManager.error(
        translation("messages.parameters.labels.error")
      );
    }
  };

  const handleChange = (key) => {
    // Create a new object with the updated value
    const updatedValues = { ...values };
    updatedValues[key] = 1 - (updatedValues[key] || 0); // Toggle between 0 and 1
    setValues(updatedValues);
  };

  const genericHandleChange = (key, newValue) => {
    const updatedValues = { ...values, [key]: newValue };
    setValues(updatedValues);
  };

  return (
    <div>
      <div className="page-head__title">
        <h1 className="h1">{translation("navbar.profile.title")}</h1>
      </div>

      <button
        className="btn-table-primary text-center"
        type="button"
        onClick={updateBackendValues}
        style={{ marginTop: "15px" }}
      >
        {translation("navbar.profile.button")}
      </button>

      {bag_label && (
        <div style={{ marginBottom: "25px", marginTop: "25px" }}>
          <div style={{ marginBottom: "25px" }}>
            <label style={{ fontSize: "1.5em" }}>
              {translation("navbar.profile.parameters.bag_label")}
            </label>
          </div>
          <div>
            {keyNamesBag.map((key, index) => (
              <div key={key} style={{ marginBottom: "10px" }}>
                <span style={{ width: "210px", display: "inline-block" }}>
                  {`${keyLabelsBag[index]}:`}
                </span>
                <input
                  type="checkbox"
                  checked={values[key] === 1}
                  onChange={() => handleChange(key)}
                />
              </div>
            ))}
          </div>

          {keyNamesBagText.map((key, index) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              <span style={{ width: "210px", display: "inline-block" }}>
                {`${keyLabelsBagText[index]}:`}
              </span>
              <input
                type="text"
                value={values[key]}
                name={key}
                maxLength={255}
                onChange={(e) => genericHandleChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
      {order_label && (
        <div style={{ marginBottom: "25px", marginTop: "25px" }}>
          <div style={{ marginBottom: "25px" }}>
            <label style={{ fontSize: "1.5em" }}>
              {translation("navbar.profile.parameters.order_label")}
            </label>
          </div>
          <div>
            {keyNamesOrder.map((key, index) => (
              <div key={key} style={{ marginBottom: "10px" }}>
                <span style={{ width: "210px", display: "inline-block" }}>
                  {`${keyLabelsOrder[index]}:`}
                </span>
                <input
                  type="checkbox"
                  checked={values[key] === 1}
                  onChange={() => handleChange(key)}
                />
              </div>
            ))}

            {keyNamesOrderText.map((key, index) => (
              <div key={key} style={{ marginBottom: "10px" }}>
                <span style={{ width: "210px", display: "inline-block" }}>
                  {`${keyLabelsOrderText[index]}:`}
                </span>
                <input
                  type="text"
                  value={values[key]}
                  name={key}
                  maxLength={255}
                  onChange={(e) => genericHandleChange(key, e.target.value)}
                />
              </div>
            ))}

            <button
              className="btn-table-primary text-center"
              type="button"
              onClick={updateBackendValues}
              style={{ marginTop: "15px" }}
            >
              {translation("navbar.profile.button")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelParameters;
