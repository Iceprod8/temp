import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useTranslation } from "react-i18next";

import { Plate6 } from "@inplan/views/inlase/Plates";
import { FaRegHandPointLeft } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

import { inlase } from "@inplan/adapters/inlaseCalls";
import { backend } from "@inplan/adapters/apiCalls";
import { useAppContext } from "@inplan/AppContext";
import BatchView from "@inplan/common/Batch/BatchView";
import { createBatchName } from "@inplan/adapters/functions";

import {
  BatchContextProvider,
  useBatchContext,
} from "@inplan/common/Batch/BatchContext";

import AlignersModalManager from "../aligners/ModalManager";

function Main() {
  const {
    setModal,
    selectedBatch,
    setLoading,
    fetchBatch,
    fetchBatches,
    sheets,
  } = useBatchContext();
  const { t: translation } = useTranslation();
  const [inlaseStatus, setInlaseStatus] = useState(null);

  const handleValidate = () => {
    setModal("modal-batch-validate");
    fetchBatch(selectedBatch, "select");
  };

  const refreshState = async () => {
    try {
      const { data: status } = await inlase.get("status");
      setInlaseStatus(status);
    } catch (e) {
      console.error(e);
      setInlaseStatus(null);
    }
  };

  const startInlase = async () => {
    if (!selectedBatch) {
      return;
    }
    setLoading(true);

    const laserSettings = [];
    const slots = [];

    // Add empty slots for offset in laser settings and slots
    for (let i = 0; i < selectedBatch.offset_on_tray; i += 1) {
      laserSettings.push({
        power: 0,
        modulation: false,
        duty_cycle: 0,
        frequency: 0,
        laser_timeOut: 35,
        vector_speed: 4192,
      });
      slots.push([]);
    }

    try {
      const laserSettingsResponse = await backend.get(
        `cutter_batches/${selectedBatch.id}/laserPower`
      );

      // message
      laserSettings.push(...laserSettingsResponse.data);

      const { data } = await backend.get(
        `cutter_batches/${selectedBatch.id}/export`
      );
      setLoading(false);

      const filledSlots = data
        .split(/--------- E[0-6]\n/)
        .splice(1)
        .map((slot) =>
          slot
            .split("\n")
            .splice(1)
            .map((l) => l.split(/\s+/).map((v) => parseFloat(v)))
            .filter((l) => l.length === 4)
        )
        .filter((s) => s.length > 0);

      slots.push(...filledSlots);

      await inlase.post("trays", {
        slots: slots.map((s, i) => ({
          id: `s${i}`,
          Power: laserSettings[i].power,
          Modulation: laserSettings[i].modulation,
          DutyCycle: laserSettings[i].duty_cycle,
          Frequency: laserSettings[i].frequency,
          LaserTimeOut: laserSettings[i].laser_timeout,
          VectorSpeed: laserSettings[i].vector_speed,
          points: s.map((p) => ({
            x: p[0],
            y: p[1],
            z: p[2],
            w: p[3],
          })),
        })),
      });

      refreshState();
    } catch (error) {
      setLoading(false);
      NotificationManager.error(
        translation("messages.inlase.error_check_inlase_is_turned_on")
      );
    }
  };

  const stopInlase = async () => {
    await inlase.post("stop");
    refreshState();
  };

  const resetInlase = async () => {
    await inlase.post("reset");
    refreshState();
  };

  // Slot offset // slot shift // slot picking

  const [selectedSlotOffset, setSelectedSlotOffset] = useState("0");

  const handleSlotOptionChange = (event) => {
    setSelectedSlotOffset(event.target.value);
  };

  const handleSlotOffset = async () => {
    await backend.patch(`cutter_batches/${selectedBatch.id}`, {
      offset_on_tray: parseInt(selectedSlotOffset, 10),
    });
    await fetchBatches();
  };

  const maxSlotOffset = selectedBatch ? 6 - selectedBatch.aligners.length : 0;
  const allSlotOffsetOptions = [
    {
      value: "0",
      label: translation("utilities.slotOffsetOptions", { nbr: 1 }),
    },
    {
      value: "1",
      label: translation("utilities.slotOffsetOptions", { nbr: 2 }),
    },
    {
      value: "2",
      label: translation("utilities.slotOffsetOptions", { nbr: 3 }),
    },
    {
      value: "3",
      label: translation("utilities.slotOffsetOptions", { nbr: 4 }),
    },
    {
      value: "4",
      label: translation("utilities.slotOffsetOptions", { nbr: 5 }),
    },
    {
      value: "5",
      label: translation("utilities.slotOffsetOptions", { nbr: 6 }),
    },
  ];
  const availableSlotOffsetOptions = allSlotOffsetOptions.filter(
    (option, index) => index <= maxSlotOffset
  );

  // Changing the sheet material

  const [selectedSheetOption, setSelectedSheetOption] = useState("0");

  const sheetOptions = sheets
    .filter((s) => s.id !== "0")
    .map((s) => ({
      label: s.name,
      value: s.id,
    }));

  useEffect(() => {
    if (sheetOptions.length !== 0 && selectedSheetOption === "0") {
      setSelectedSheetOption(sheetOptions[0].value);
    }
  }, [sheetOptions]);

  const handleSheetOptionChange = (event) => {
    setSelectedSheetOption(event.target.value);
  };

  const handleSheetOptionConfirm = async () => {
    const promises = selectedBatch.aligners.map((aligner) =>
      backend.patch(`ordered_aligners/${aligner.id}`, {
        sheet: selectedSheetOption,
      })
    );
    await Promise.all(promises);
    await fetchBatches();
  };

  return (
    <main className="page-main">
      <div className="page-head">
        <div className="page-head__title">
          <h1 className="h1">{translation("inlase.title")}</h1>
        </div>
        <div className="page-head__actions">
          <button
            className="btn-primary"
            type="button"
            onClick={refreshState}
            style={{ marginRight: "20px" }}
          >
            {translation("inlase.buttons.refresh")}
          </button>

          <button
            className="btn-stop"
            type="button"
            onClick={stopInlase}
            style={{ marginRight: "20px" }}
          >
            {translation("inlase.buttons.stop")}
          </button>

          <button className="btn-danger" type="button" onClick={resetInlase}>
            {translation("inlase.buttons.reset")}
          </button>
        </div>
      </div>
      <div className="page-tab">
        <Plate6
          selectedBatch={selectedBatch}
          name={createBatchName(selectedBatch, "aligners", translation)}
        />
        <div>
          {selectedBatch ? (
            <>
              <div
                className="flex alignItems-center"
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    color: "red",
                  }}
                >
                  {translation("inlase.warning")}
                </div>
                <button
                  className="btn-table-primary"
                  type="button"
                  onClick={() => {
                    setModal("modal-batch-view");
                    fetchBatch(selectedBatch, "select");
                  }}
                >
                  {translation("inlase.buttons.edit_selected_batch")}
                </button>
              </div>

              <div style={{ marginTop: "20px" }}>
                <button
                  className="btn-cut"
                  type="button"
                  onClick={startInlase}
                  style={{ marginRight: "20px" }}
                >
                  {translation("inlase.buttons.cut")}
                </button>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={handleValidate}
                >
                  {translation("inlase.buttons.confirm")}
                </button>
              </div>
              <div style={{ marginTop: "20px" }}>
                <select
                  value={selectedSlotOffset}
                  onChange={handleSlotOptionChange}
                  style={{ marginLeft: "20px", marginRight: "10px" }}
                >
                  {availableSlotOffsetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  className="btn-table-primary text-center"
                  type="button"
                  onClick={handleSlotOffset}
                  style={{ marginRight: "10px" }}
                >
                  {translation("inlase.buttons.apply_new_slot")}
                </button>
              </div>

              <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                <select
                  value={selectedSheetOption}
                  onChange={handleSheetOptionChange}
                  style={{ marginLeft: "20px", marginRight: "10px" }}
                >
                  {sheetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  className="btn-table-primary text-center"
                  type="button"
                  onClick={handleSheetOptionConfirm}
                  style={{ marginRight: "10px" }}
                >
                  {translation("inlase.buttons.apply_sheet")}
                </button>
              </div>
            </>
          ) : null}
        </div>

        <div>
          <h4 className="h4">{translation("inlase.table.name")}</h4>
          <table style={{ width: "50%", margin: "100px" }}>
            <thead>
              <tr>
                <th>{translation("inlase.table.titles.status")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>{translation("inlase.table.rows.available")}</th>
                <td>
                  {inlaseStatus
                    ? `${translation("inlase.table.options.ok")}`
                    : `${translation("inlase.table.options.ko")}`}
                </td>
              </tr>
              {inlaseStatus ? (
                <>
                  <tr>
                    <th>{translation("inlase.table.rows.doors")}</th>
                    <td>
                      {inlaseStatus?.doors
                        ? `${translation("inlase.table.options.close")}`
                        : `${translation("inlase.table.options.open")}`}
                    </td>
                  </tr>
                  <tr>
                    <th>{translation("inlase.table.rows.cutting")}</th>
                    <td>
                      {inlaseStatus?.is_cutting
                        ? `${translation("inlase.table.options.cutting")}`
                        : `${translation("inlase.table.options.not_cutting")}`}
                    </td>
                  </tr>
                  <tr>
                    <th>{translation("inlase.table.rows.cutlines_ready")}</th>
                    <td>
                      {inlaseStatus?.tray
                        ? `${translation("inlase.table.options.loaded")}`
                        : `${translation("inlase.table.options.not_loaded")}`}
                    </td>
                  </tr>
                </>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Actions({ batch, selectedBatch }) {
  const { setModal, fetchBatch } = useBatchContext();

  const colorSelectedBatch =
    batch?.id === selectedBatch?.id ? "text-danger" : "text-primary";

  return (
    <>
      <div
        className="btn-rounded-tertiary"
        onClick={() => {
          fetchBatch(batch, "select");
        }}
      >
        <FaRegHandPointLeft
          name="download"
          className={`icon icon-download ${colorSelectedBatch}`}
          size={40}
        />
      </div>
      <div />
      <div
        className="btn-rounded-tertiary"
        data-test="batch_modify"
        onClick={() => {
          setModal("modal-batch-view");
          fetchBatch(batch, "select");
        }}
      >
        <FiEdit name="edit" className="icon icon-edit" />
      </div>
    </>
  );
}

export default function Inlase() {
  const { getUserRights } = useAppContext();
  useEffect(() => {
    getUserRights();
  }, []);
  return (
    // alignerStatus 14 : To cut (not in batch yet)
    <BatchContextProvider
      batchType="CUTTER"
      alignerStatus={14}
      maxBatchSize={6}
    >
      <BatchView subject="aligners" Main={<Main />} Actions={Actions}>
        <AlignersModalManager />
      </BatchView>
    </BatchContextProvider>
  );
}
