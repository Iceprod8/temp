import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import { useDashboardContext } from "./Context";
import Period from "./Period";

export default function DashboardControlInfos() {
  const { t: translation } = useTranslation();
  const { setModal, currentPeriod, updatePeriod, periods, setCurrentPeriod } =
    useDashboardContext();
  const showSnackbar = useSnackbar();
  const [myStep, setMyStep] = useState(null);

  useEffect(() => {
    setMyStep(currentPeriod);
  }, [currentPeriod, myStep]);

  const handleSubmit = async (data) => {
    try {
      await updatePeriod(currentPeriod.id, data);
      showSnackbar(
        translation("messages.period_information.period_updated"),
        "success",
      );
    } catch (err) {
      console.error(err);
    }
  };
  const location = useLocation();

  useEffect(() => {
    if (location.state && !currentPeriod) {
      const filteredPeriod = periods.filter(
        (period) => period.id === location.state.stepId,
      );
      if (filteredPeriod.length > 0) {
        setCurrentPeriod(filteredPeriod[0]);
      }
    }
  }, [periods]);

  if (!currentPeriod) {
    return (
      <div
        className="flex flex-column alignItems-center"
        style={{ marginTop: "20px" }}
      >
        {periods.length > 0 && (
          <div>{translation("dashboard.period_information.select_period")}</div>
        )}
        {periods.length > 0 && (
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            {translation("utilities.variables.or")}
          </div>
        )}
        <div>
          <button
            type="button"
            className="btn-modal-secondary"
            onClick={() => setModal("modal-createPeriod")}
            data-test="new_period_btn"
          >
            {translation("dashboard.period_information.add_new_period_button")}
          </button>
        </div>
      </div>
    );
  }

  const reset = () => {
    setMyStep(null);
  };

  const title = `${translation(
    "dashboard.period_information.create_form.title_update",
  )} : ${currentPeriod.name}`;

  return (
    <div
      className="flex flex-column justify-center alignItems-center"
      style={{
        paddingLeft: "20%",
        paddingRight: "20%",
        paddingTop: "3%",
        paddingBottom: "5%",
      }}
    >
      <div>
        <button
          type="button"
          className="btn-modal-secondary"
          onClick={() => setModal("modal-createPeriod")}
          data-test="new_period_btn"
        >
          {translation("dashboard.period_information.add_new_period_button")}
        </button>
      </div>
      <div style={{ marginBottom: "20px", marginTop: "20px" }}>
        {title.toUpperCase()}
      </div>
      <div>
        <Period
          handleSubmit={handleSubmit}
          submitName={translation(
            "dashboard.period_information.create_form.buttons.update",
          )}
          handleCancel={reset}
          cancelName={translation(
            "dashboard.period_information.create_form.buttons.reset",
          )}
          step={myStep}
          labelColor="#FFFFFF"
        />
      </div>
    </div>
  );
}
