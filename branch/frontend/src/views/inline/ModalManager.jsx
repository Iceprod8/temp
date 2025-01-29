import React from "react";
import Fade from "@inplan/common/Fade";
import ModelEditModal from "./ModelEditModal";
import { useInlineContext } from "./InlineContext";

function LocalModal({ name, children }) {
  const { modal } = useInlineContext();
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

export default function DashboardModalManager() {
  return (
    <>
      <LocalModal name="modal-model-edit">
        <ModelEditModal />
      </LocalModal>
    </>
  );
}
