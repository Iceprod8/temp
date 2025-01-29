import React, { useEffect, useState } from "react";

import { inlase } from "@inplan/adapters/inlaseCalls";
import CalibrationCut from "@inplan/views/calibration/CalibrationCut";
import InlaseOffsetInterface from "@inplan/views/calibration/InlaseOffsetInterface";
import { useAppContext } from "@inplan/AppContext";
import MaterialSettingInterface from "./MaterialSettingInterface";

/*  function MainCalibration() { */
export default function Calibration() {
  const { userData, getUserRights } = useAppContext();
  const [setInlaseStatus] = useState(null);

  useEffect(() => {
    getUserRights();
  }, []);
  const refreshState = async () => {
    try {
      const { data: status } = await inlase.get("status");
      setInlaseStatus(status);
    } catch (e) {
      console.error(e);
      setInlaseStatus(null);
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

  return (
    <div className="page-light page">
      <main className="page-main">
        {userData.is_admin ? (
          <>
            <div className="page-head">
              <div className="page-head__title">
                <h1 className="h1">Calibrage - reservé à Orthoin3D</h1>
              </div>
              <div style={{ marginTop: "30px" }}>
                <button
                  className="btn-secondary rounded"
                  type="button"
                  onClick={stopInlase}
                >
                  Arrêt InLase
                </button>

                <button
                  className="btn-secondary rounded"
                  type="button"
                  onClick={resetInlase}
                >
                  Déblocage InLase
                </button>
              </div>
            </div>
            <div className="page-tab">
              <CalibrationCut />
              <MaterialSettingInterface />
              <InlaseOffsetInterface />
            </div>
          </>
        ) : (
          <div>Unauthorized user</div>
        )}
      </main>
    </div>
  );
}
