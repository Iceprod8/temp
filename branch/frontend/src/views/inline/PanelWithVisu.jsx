import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useInlineContext } from "@inplan/contexts/InlineContext";
import Visualizer from "./modeleditor/Visualizer";
import ModalTranslate from "./ModalTranslate";
import ModalBody from "./ModalBody";
import Toolbar from "./Toolbar";

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

export default function PanelWithVisu({ hidden, setAnimate, setIsTranslate }) {
  const { currentModel, setState, loading, fetchPatient } = useInlineContext();
  const { idPatient } = useParams();
  const { t: translation } = useTranslation();
  const titles = getSubPageConf(translation, "cutlines");
  const [title, iconName] = titles || ["", ""];
  const [meshOpacity, setMeshOpacity] = useState(false);

  useEffect(() => {
    if (!idPatient) return;
    fetchPatient(idPatient);
  }, [idPatient, fetchPatient]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      simulator: false,
      orientation: "",
      transOrRot: { activeTrans: false, activeRot: false, x: 1, y: 0, z: 1 },
    }));
  }, [currentModel, setState]);

  useEffect(() => {
    setState((prev) => ({ ...prev, enableCutline: true }));
  }, [setState]);

  return (
    <>
      <ModalTranslate onClick={setIsTranslate} setAnimate={setAnimate} />
      <div
        className={clsx("dashboard-body__control", hidden ? "is-hidden" : null)}
      >
        {!loading.setups && (
          <ModalBody
            setAnimate={setAnimate}
            title={title}
            iconName={iconName}
            onClose={setIsTranslate}
            setMeshOpacity={setMeshOpacity}
            meshOpacity={meshOpacity}
          />
        )}
      </div>
      <div className="dashboard-body__visualizer">
        <Toolbar />
        <div className="dashboard-visualizers">
          <div className="visualizer">
            {currentModel && (
              <div className="visualizer__info">{currentModel.filename}</div>
            )}
            <Visualizer loading={loading.model} meshOpacity={meshOpacity} />
          </div>
        </div>
      </div>
    </>
  );
}
