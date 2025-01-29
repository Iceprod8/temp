import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";

import BasicSelect from "@inplan/common/BasicSelect";
import { toISODateString, daysFromDuration } from "@inplan/adapters/functions";
import { useAppContext } from "@inplan/AppContext";

import { useDashboardContext } from "./Context";

export default function Period({
  handleSubmit,
  handleCancel,
  submitName,
  cancelName,
  step,
  labelColor,
}) {
  const { t: translation } = useTranslation();
  const { practitioner } = useAppContext();

  const {
    patient,
    createSetup,
    setups,
    latestSetup,
    periods,
    models,
    fetchPatientModels,
  } = useDashboardContext();

  // WARNING this is selected setup local to this file, not context
  // TODO deifferentiate the naming
  const [selectedSetup, setSelectedSetup] = useState({ id: "" });
  const [selectedModels, setSelectedModels] = useState([]);
  const [wearDuration, setWearDuration] = useState(14);
  const [minRank, setMinRank] = useState(0);
  const [maxRank, setMaxRank] = useState(0);
  const [end, setEnd] = useState("");
  const [start, setStart] = useState("");
  const [computedEnd, setComputedEnd] = useState("");
  const [setupModels, setFilteredModels] = useState([]);

  useEffect(() => {
    if (step) {
      setSelectedModels(models.filter((m) => step.models.includes(m.id)));
      setWearDuration(daysFromDuration(step.resolved_wear_duration));
      setStart(step.start_date);
      // TODO: check the target behavior
      // setEnd(step.end_date);
      setMinRank(step.min_rank);
      setMaxRank(step.max_rank);
      setStart(step.start_date);
      setEnd(step.end_date);
    }
  }, [step]);

  /* Set by default the last setup */
  useEffect(() => {
    if (step) {
      const setup = setups.find((s) => s.id === step.setup);
      setSelectedSetup(setup);
    } else if (latestSetup) {
      setSelectedSetup(latestSetup);
    }
  }, [latestSetup, step]);

  useEffect(() => {
    if (!selectedSetup || !models) return;

    const fmodels = models
      .filter(
        (m) =>
          m.setup.id === selectedSetup.id && (!m.step || m.step.id === step?.id)
      )
      .map((m) => ({
        ...m,
        name: `${m.type === 0 ? "upper" : "lower"} ${m.rank}`,
      }));
    setFilteredModels(fmodels);
  }, [models, selectedSetup, step]);

  useEffect(() => {
    const now = new Date();

    const sorted = periods
      .map((p) => [new Date(p.end_date), p])
      .sort(([a], [b]) => b - a);

    const strNow = toISODateString(now);

    if (sorted.length >= 1 && sorted[0][0] > now && !step) {
      setStart(sorted[0][1].end_date);
    } else if (sorted.length >= 1 && sorted[0][0] > now && step) {
      setStart(start);
    } else {
      setStart(strNow);
    }
  }, [periods]);

  useEffect(() => {
    if (start) {
      const nbAligners = Math.max(maxRank - minRank + 1, 1);
      const dstart = new Date(start);
      const cend = new Date(
        dstart.getTime() + wearDuration * 1000 * 60 * 60 * 24 * nbAligners
      );
      setComputedEnd(toISODateString(cend));
    }
  }, [start, minRank, maxRank, wearDuration]);

  const myHandleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const input = form.elements[1];
    if (input.value === "") {
      input.setAttribute("disabled", "");
    }

    const data = Object.fromEntries(new FormData(form));
    /* If no setup was selected, create one */
    const setup = selectedSetup?.id
      ? selectedSetup
      : await createSetup(patient.id, { name: "Auto setup" });

    await handleSubmit({
      setup: setup.id,
      start_date: data.start_date || undefined,
      end_date: data.end_date || undefined,
      default_sheet: practitioner?.default_sheet?.id || undefined,
      models: selectedModels.map((m) => m.id),
      wear_duration: `${data.wear_duration} 00:00:00`,
      min_rank: minRank,
      max_rank: maxRank,
    });

    fetchPatientModels();
  };

  const handleChangeWearDuration = (e) => {
    if (e.target.value >= 0) {
      setWearDuration(e.target.value);
    } else {
      NotificationManager.error(
        translation("messages.period_information.error_wear_duration")
      );
    }
  };

  const handleChangeMinRank = (e) => {
    const isNumber = /^\d+$/.test(e.target.value);
    if (isNumber && parseInt(e.target.value, 10) >= 0) {
      setMinRank(e.target.value);
      setMaxRank(e.target.value);
    } else {
      NotificationManager.error(
        translation("messages.period_information.error_min_rank")
      );
    }
  };

  const handleChangeMaxRank = (e) => {
    const isNumber = /^\d+$/.test(e.target.value);
    if (
      isNumber &&
      parseInt(e.target.value, 10) >= 0 &&
      parseInt(e.target.value, 10) >= parseInt(minRank, 10)
    ) {
      setMaxRank(e.target.value);
      setEnd(null);
    } else {
      NotificationManager.error(
        translation("messages.period_information.error_max_rank")
      );
    }
  };
  useEffect(() => {
    // Filtering periods based on a selected setup ID
    const filteredPeriods = periods.filter((period) => {
      return period.setup === selectedSetup.id;
    });
    // Sorting the filtered periods based on their max_rank property in descending order
    filteredPeriods.sort(
      (firstPeriod, secondPeriod) =>
        secondPeriod.max_rank - firstPeriod.max_rank
    );
    // Checking if there are any periods for the selected setup and
    // if the 'step' does not exist, indicating that it's creating a new period, not updating an existing one
    if (filteredPeriods.length > 0 && !step) {
      // Setting the minimum and maximum rank based on the max_rank property of the first period in the sorted filtered list
      setMinRank(filteredPeriods[0].max_rank + 1);
      setMaxRank(filteredPeriods[0].max_rank + 1);
    }
  }, [selectedSetup]);

  return (
    <form className="form" onSubmit={(e) => myHandleSubmit(e)}>
      <div className="grid2">
        <div className="form-group">
          <label style={{ color: labelColor }}>
            {translation("dashboard.period_information.create_form.setup")}
          </label>
          <BasicSelect
            value={selectedSetup}
            setValue={setSelectedSetup}
            data-test="selectSetup"
            data={{
              name: "setups",
              label: "Setups",
              choices: setups,
            }}
            styles={{
              classes: "btn-tertiary",
              boxStyle: { height: "50px", width: "200px" },
              fontSettings: { fontSize: "15px" },
              selectLabel: { color: "var(--color-primary)" },
            }}
          />
        </div>
      </div>

      <div className="grid2">
        <div className="form-group" style={{ marginTop: "15px" }}>
          <label htmlFor="wear_duration" style={{ color: labelColor }}>
            {translation("dashboard.period_information.create_form.ranks.from")}
          </label>
          <input
            type="number"
            name="minRank"
            required
            onChange={(e) => handleChangeMinRank(e)}
            value={minRank}
            min={0}
          />
        </div>

        <div className="form-group" style={{ marginTop: "15px" }}>
          <label htmlFor="wear_duration" style={{ color: labelColor }}>
            {translation("dashboard.period_information.create_form.ranks.to")}
          </label>
          <input
            type="number"
            name="maxRank"
            required
            onChange={(e) => handleChangeMaxRank(e)}
            value={maxRank}
            min={0}
          />
        </div>
      </div>

      <div className="grid2" style={{ marginTop: "15px" }}>
        <div className="form-group">
          <label htmlFor="wear_duration" style={{ color: labelColor }}>
            {translation(
              "dashboard.period_information.create_form.wear_duration"
            )}
          </label>
          <input
            type="number"
            name="wear_duration"
            required
            onChange={(e) => handleChangeWearDuration(e)}
            value={wearDuration}
            min={0}
          />
        </div>
      </div>

      <div className="grid2" style={{ marginTop: "15px" }}>
        <div className="form-group">
          <label htmlFor="start_date" style={{ color: labelColor }}>
            {translation("dashboard.period_information.create_form.start_date")}
          </label>
          <input
            type="date"
            name="start_date"
            id="start_date"
            required
            onChange={(e) => setStart(e.target.value)}
            value={start}
          />
        </div>
        <div className="form-group" style={{ marginTop: "" }}>
          <label htmlFor="end_date" style={{ color: labelColor }}>
            {translation("dashboard.period_information.create_form.end_date")}
          </label>
          <input
            type="date"
            name="end_date"
            id="end_date"
            onChange={(e) => setEnd(e.target.value)}
            value={end || computedEnd}
          />
        </div>
      </div>
      <div className="modal-content__btn grid2">
        <button
          className="btn-modal-muted"
          type="button"
          onClick={handleCancel}
        >
          {cancelName}
        </button>
        <button
          className="btn-modal-secondary"
          type="submit"
          data-test="create_periode_submit"
        >
          {submitName}
        </button>
      </div>
    </form>
  );
}
