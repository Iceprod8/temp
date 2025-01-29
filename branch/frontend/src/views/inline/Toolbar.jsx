import React from "react";
import { useAppContext } from "@inplan/AppContext";
import { IconContext } from "react-icons";
import showTop from "@inplan/assets/images/inline/show-top.png";
import showBottom from "@inplan/assets/images/inline/show-bottom.png";
import showFront from "@inplan/assets/images/inline/show-front.png";
import showBack from "@inplan/assets/images/inline/show-back.png";
import showLeft from "@inplan/assets/images/inline/show-left.png";
import showRight from "@inplan/assets/images/inline/show-right.png";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import { useInlineContext } from "./InlineContext";

export default function DashboardToolbar() {
  const {
    currentModel,
    toggleCurrentModelValidation,
    resetToCreationMode,
    setOrientation,
    creationMode,
    createCutline,
    setIsSavingRequested,
  } = useInlineContext();
  const { userRights } = useAppContext();
  const isInCreationMode =
    currentModel && creationMode && !currentModel.is_cutline_on_process;

  // const isInLineGeneration = currentModel && currentModel.is_cutline_on_process;

  const isInEditionMode =
    currentModel &&
    !creationMode &&
    currentModel.active_cutline &&
    !currentModel.is_validated;

  // const isInBaseProcess = currentModel && currentModel.is_base_on_process;

  const isInVerificationMode =
    !creationMode &&
    currentModel &&
    currentModel.is_validated &&
    !currentModel.is_base_on_process;

  return (
    <IconContext.Provider value={{ color: "#2061D1", size: "1.4em" }}>
      <div className="dashboard-toolbar__container">
        <div className="dashboard-toolbar__left">
          {userRights?.inline && isInVerificationMode ? (
            <button
              type="button"
              className="btn-tertiary"
              onClick={toggleCurrentModelValidation}
            >
              <CustomTranslation text="dashboard.cutlines.toolbar.edit" />
            </button>
          ) : null}
          {/* inline if */}
          {userRights?.inline && isInEditionMode ? (
            <>
              <button
                type="button"
                className="btn-tertiary"
                onClick={() => {
                  toggleCurrentModelValidation();
                }}
              >
                <CustomTranslation text="dashboard.cutlines.toolbar.validate" />
              </button>
              <button
                type="button"
                className="btn-tertiary"
                onClick={() => {
                  setIsSavingRequested(true);
                }}
                style={{ marginLeft: "8px" }}
              >
                <CustomTranslation text="dashboard.cutlines.toolbar.save" />
              </button>
              <button
                type="button"
                className="btn-tertiary"
                onClick={resetToCreationMode}
                style={{ marginLeft: "8px" }}
              >
                <CustomTranslation text="dashboard.cutlines.toolbar.delete" />
              </button>
            </>
          ) : null}
          {userRights?.inline && isInCreationMode ? (
            <button
              type="button"
              className="btn-tertiary"
              onClick={createCutline}
            >
              <CustomTranslation text="dashboard.cutlines.toolbar.initialize" />
            </button>
          ) : null}
        </div>
        <div className="dashboard-toolbar__middle" />
        <div className="dashboard-toolbar__right">
          <img
            alt="showTop"
            src={showTop}
            name="top"
            onClick={() => setOrientation("top")}
            style={{ height: "45px" }}
          />
          <img
            alt="showBottom"
            src={showBottom}
            name="bottom"
            onClick={() => setOrientation("bottom")}
            style={{ height: "45px" }}
          />
          <img
            alt="showFront"
            src={showFront}
            name="front"
            onClick={() => setOrientation("front")}
            style={{ height: "45px" }}
          />
          <img
            alt="showBack"
            src={showBack}
            name="back"
            onClick={() => setOrientation("back")}
            style={{ height: "45px" }}
          />
          <img
            alt="showLeft"
            src={showLeft}
            name="left"
            onClick={() => setOrientation("left")}
            style={{ height: "45px" }}
          />
          <img
            alt="showRight"
            src={showRight}
            name="right"
            onClick={() => setOrientation("right")}
            style={{ height: "45px" }}
          />
        </div>
      </div>
    </IconContext.Provider>
  );
}
