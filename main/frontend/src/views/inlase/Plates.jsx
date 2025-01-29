import React from "react";
import { useTranslation } from "react-i18next";
import Slot from "./Slot";

// FIXME Comment
// FIXME into inplan view because only used here, not common

function Plate6({ selectedBatch, name }) {
  const { t: translation } = useTranslation();
  // Init reduced aligner list for slots - displayAligners
  const displayAligners = [];

  if (selectedBatch && selectedBatch.aligners) {
    // Add the slot offset on tray
    // Empty aligners are added in front to offset the first slot.
    // Those aligners only contains the "empty" information,
    // because it was already used by the slot elements to filter display

    // Loop on offset to add empty slots
    for (let i = 0; i < selectedBatch.offset_on_tray; i += 1) {
      displayAligners.push({ short_code: "empty" });
    }
    // Loop on models to add to display
    const copyAligners = selectedBatch.aligners.map((obj) => ({ ...obj }));
    displayAligners.push(...copyAligners);
  }

  return (
    <div className="grid">
      <h4 className="h4">
        {translation("utilities.variables.machining_table")}{" "}
        {name ? `${translation("utilities.variables.of")}  ${name}` : null}
      </h4>
      <table className="table table-slots">
        <tbody>
          {selectedBatch && selectedBatch.aligners ? (
            <>
              <tr>
                <Slot index={0} aligners={displayAligners} />

                <Slot index={1} aligners={displayAligners} />

                <Slot index={2} aligners={displayAligners} />
              </tr>
              <tr>
                <Slot index={3} aligners={displayAligners} />

                <Slot index={4} aligners={displayAligners} />

                <Slot index={5} aligners={displayAligners} />
              </tr>
            </>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function Plate4({ selectedBatch, name }) {
  const { t: translation } = useTranslation();
  return (
    <div className="grid">
      <h4 className="h4">
        {translation("utilities.variables.machining_table")}{" "}
        {name ? `${translation("utilities.variables.of")}  ${name}` : null}
      </h4>
      <table className="table table-slots">
        <tbody>
          {selectedBatch && selectedBatch.aligners ? (
            <>
              <tr>
                <Slot index={0} selectedBatch={selectedBatch} />

                <Slot index={1} selectedBatch={selectedBatch} />
              </tr>
              <tr>
                <Slot index={2} selectedBatch={selectedBatch} />

                <Slot index={3} selectedBatch={selectedBatch} />
              </tr>
            </>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export { Plate6, Plate4 };
