import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BsPlusCircle } from "react-icons/bs";
import { useAppContext } from "@inplan/AppContext";

import { NotificationManager } from "react-notifications";
import { useHistory } from "react-router-dom";

import { useDashboardContext } from "./Context";
import Period from "./Period";

export default function DashboardControlInfos() {
  const { t: translation } = useTranslation();
  const { updateModale } = useAppContext();
  const { setModal, currentPeriod, updatePeriod, periods, setCurrentPeriod } =
    useDashboardContext();

  const [myStep, setMyStep] = useState(null);

  useEffect(() => {
    setMyStep(currentPeriod);
  }, [currentPeriod, myStep]);

  const handleSubmit = async (data) => {
    try {
      await updatePeriod(currentPeriod.id, data);
      NotificationManager.success(
        translation("messages.period_information.period_updated")
      );
    } catch (err) {
      console.error(err);
    }
  };
  const history = useHistory();

  useEffect(() => {
    // Check if there is any state passed through history
    if (history.location.state && !currentPeriod) {
      // Get the period to set based on 'stepId' from history state
      const filteredPeriod = periods.filter((period) => {
        return period.id === history.location.state.stepId;
      });
      // set the current period to the first match
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
    "dashboard.period_information.create_form.title_update"
  )} : ${currentPeriod.name}`;

  return (
    <>
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
              "dashboard.period_information.create_form.buttons.update"
            )}
            handleCancel={reset}
            cancelName={translation(
              "dashboard.period_information.create_form.buttons.reset"
            )}
            step={myStep}
            labelColor="#FFFFFF"
          />
        </div>
      </div>
    </>
  );
}
