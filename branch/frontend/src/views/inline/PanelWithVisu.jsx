import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import clsx from "clsx";
import Fade from "@inplan/common/Fade";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";

import Visualizer from "./modeleditor/Visualizer";
import ModalTranslate from "./ModalTranslate";
import ModalBody from "./ModalBody";
import Toolbar from "./Toolbar";
import { useInlineContext } from "./InlineContext";
import DashboardModalManager from "./ModalManager";

const getSubPageConf = (translation, page) => {
  const myPage = {
    models: ["3D models", "model"],
    cutlines: [translation("dashboard.cutlines.title"), "aligneur"],
    informations: ["Period information", "generalInfo"],
    aligneurs: ["Aligners", "plan"],
    export: ["Export", "export"],
    orders: ["Orders", "orders"],
  };
  return myPage[page];
};

export default function PanelWithVisu({
  hidden,
  animate,
  setAnimate,
  isTranslate,
  setIsTranslate,
}) {
  const {
    currentModel,
    refreshModelStatus,
    setEnableCutline,
    currentCutline,
    simulator,
    orientation,
    setSimulator,
    setOrientation,
    setTransOrRot,
    transOrRot,
    detailedLoading,
    creationMode,
    saveInitPoints,
    collisionIndexes,
    fetchPatient,
    saveCurrentCutline,
    isSavingRequested,
    forceSaveCurrentCutline,
    loadingSetups,
    patient,
  } = useInlineContext();

  const { idPatient } = useParams();
  const { t: translation } = useTranslation();

  const titles = getSubPageConf(translation, "cutlines");
  const [title, iconName] = titles || ["", ""];

  const [meshOpacity, setmeshOpacity] = useState(false);

  // Fetch patient
  useEffect(() => {
    if (!idPatient) return;
    /* Fetch the patient */
    fetchPatient(idPatient);
  }, [idPatient]);

  useEffect(() => {
    setSimulator(false);
    setOrientation("");
    setTransOrRot({ activeTrans: false, activeRot: false, x: 1, y: 0, z: 1 });
  }, [currentModel]);

  useEffect(() => {
    setEnableCutline(true);
  }, []);

  return (
    <>
      <DashboardModalManager />
      <Fade
        visible={isTranslate}
        type="translate3D"
        from={{ opacity: 0, x: -8 }}
      >
        <ModalTranslate onClick={setIsTranslate} setAnimate={setAnimate} />
      </Fade>

      <Fade visible={animate} type="translate3D" from={{ opacity: 0, x: -16 }}>
        <div
          className={clsx(
            "dashboard-body__control",
            hidden ? "is-hidden" : null
          )}
        >
          {!loadingSetups && (
            <ModalBody
              setAnimate={setAnimate}
              title={title}
              iconName={iconName}
              onClose={setIsTranslate}
              setmeshOpacity={setmeshOpacity}
              meshOpacity={meshOpacity}
            />
          )}
        </div>
      </Fade>

      <div className="dashboard-body__visualizer">
        <Toolbar />
        <div className="dashboard-visualizers">
          <div className="visualizer">
            {currentModel ? (
              <div className="visualizer__info">{currentModel.filename}</div>
            ) : null}
            <Visualizer
              path={
                currentModel
                  ? currentModel.is_validated && currentModel.base
                    ? currentModel.base_decimate
                    : currentModel.decimate
                  : null
              }
              currentCutline={currentCutline}
              setPendingCutline={saveCurrentCutline}
              editing={currentModel && !currentModel.is_validated}
              creating={creationMode}
              saveInitPoints={saveInitPoints}
              simulator={simulator}
              orientation={orientation}
              setOrientation={setOrientation}
              transOrRot={transOrRot}
              setSimulator={setSimulator}
              loading={detailedLoading.model}
              collisionIndexes={collisionIndexes}
              isSavingRequested={isSavingRequested}
              saveCurrentCutlineCallback={forceSaveCurrentCutline}
              meshOpacity={meshOpacity}
            />
          </div>
        </div>
      </div>
    </>
  );
}
