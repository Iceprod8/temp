import React from "react";

import Fade from "@inplan/common/Fade";

import { useDashboardContext } from "./Context";
import CreateModalPeriod from "./CreatePeriodModals";
import DeleteModalPeriod from "./DeleteModalPeriod";

function LocalModal({ name, children }) {
  const { modal } = useDashboardContext();
  const zIndex = 1000;

  return (
    <Fade
      visible={modal === name}
      duration={300}
      zIndex={zIndex}
      from={{ opacity: 0 }}
    >
      {children}
    </Fade>
  );
}

export default function DashboardModalManager({ onValidation }) {
  return (
    <>
      <LocalModal name="modal-createPeriod">
        <CreateModalPeriod />
      </LocalModal>

      <LocalModal name="modal-deletePeriod">
        <DeleteModalPeriod />
      </LocalModal>
    </>
  );
}
