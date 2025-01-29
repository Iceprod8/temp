import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingOverlay from "react-loading-overlay";
import ThreeComponent from "./ThreeComponent";

export default function Visualizer({
  path,
  currentCutline,
  setPendingCutline,
  simulator,
  setSimulator,
  orientation,
  setOrientation,
  transOrRot,
  editing,
  creating,
  saveInitPoints,
  loading,
  collisionIndexes,
  isSavingRequested,
  saveCurrentCutlineCallback,
  meshOpacity,
}) {
  const [iloading, setIloading] = useState(false);
  const { t: translation } = useTranslation();
  return (
    <LoadingOverlay
      active={loading || iloading}
      spinner
      text={translation("messages.common.loading")}
      styles={{ wrapper: { height: "100%" } }}
    >
      <ThreeComponent
        model={path}
        cutline={currentCutline}
        cutlineUpdate={setPendingCutline}
        editing={editing}
        creating={creating}
        saveInitPoints={saveInitPoints}
        simulator={simulator}
        orientation={orientation}
        setOrientation={setOrientation}
        transOrRot={transOrRot}
        setSimulator={setSimulator}
        setLoading={setIloading}
        collisionIndexes={collisionIndexes}
        isSavingRequested={isSavingRequested}
        saveCurrentCutlineCallback={saveCurrentCutlineCallback}
        meshOpacity={meshOpacity}
      />
    </LoadingOverlay>
  );
}
