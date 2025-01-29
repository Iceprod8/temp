import React from "react";

export default function TreatmentPeriodCol(
  rowData,
  translation,
  history,
  language
) {
  const { patient, activeStep: step } = rowData;

  const handleOnClick = () => {
    history.push({
      pathname: `/dashboard/${patient.id}/periods`,
      state: { stepId: step.id },
    });
  };

  let color_date = "green";
  let step_start_date = "";
  let step_end_date = "";
  if (step) {
    // set alert color
    const now = new Date();
    const end_date = new Date(step.end_date);
    const date1Ms = now.getTime();
    const date2Ms = end_date.getTime();
    const differenceMs = date2Ms - date1Ms;
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    if (differenceDays >= 0 && differenceDays < 15) {
      color_date = "orange";
    }
    if (differenceDays < 0) {
      color_date = "red";
    }
    // set data format based on language
    if (language === "en") {
      step_start_date = step?.start_date;
      step_end_date = step?.end_date;
    } else {
      step_start_date = new Date(step?.start_date)
        .toLocaleDateString("fr-FR")
        .replace(/\//g, "-");
      step_end_date = new Date(step?.end_date)
        .toLocaleDateString("fr-FR")
        .replace(/\//g, "-");
    }
  }

  return (
    <div className="flex alignItems-center">
      {patient.archived ? (
        <span>
          {translation("patients.table.treatment_period_options.archived")}
        </span>
      ) : step ? (
        <div className="" onClick={() => handleOnClick()}>
          <div>
            <div style={{ fontWeight: "600" }}>{step.name}</div>
            <div>
              <div>
                {translation("patients.table.treatment_period_options.start")}
                {"\u00A0:\u00A0"}
                {step_start_date}
              </div>
              {/* {translation("patients.table.treatment_period_options.to")} */}
              <div>
                {translation("patients.table.treatment_period_options.end")}
                {"\u00A0:\u00A0"}
                <span style={{ color: color_date }}>{step_end_date}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        `${translation("patients.table.treatment_period_options.no_defined")}`
      )}
    </div>
  );
}
